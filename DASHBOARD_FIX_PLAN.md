# Dashboard Fix Plan — Exclusive E-Commerce
**للـ OpenCode:** نفّذ كل task بالترتيب. كل task مستقلة ومحددة. لا تعدّل أي ملف خارج الملفات المذكورة في كل task.

---

## TASK 1 — Fix monthly aggregations (last 12 months)
**ملف:** `backend/controllers/AdminController.js`

**المشكلة:** الـ `monthlyRevenue` و`monthlyOrders` aggregations تستخدم `$limit: 12` بدون `$match` على التاريخ، فترجع أقدم 12 شهر مش آخر 12 شهر.

**التعديل:** أضف `$match` بفلتر التاريخ في أول كل pipeline. استبدل الـ aggregations الموجودة بالكود التالي:

```js
// في دالة getAdminStats، استبدل monthlyRevenue aggregate بـ:
const twelveMonthsAgo = new Date();
twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

// ثم مرر هاد المتغير للـ aggregations:

// Monthly revenue (last 12 months) — استبدل الـ aggregate الحالي:
Order.aggregate([
    {
        $match: {
            createdAt: { $gte: twelveMonthsAgo },
            status: { $nin: ["cancelled", "returned"] }
        }
    },
    {
        $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            revenue: { $sum: "$totalOrderPrice" },
        }
    },
    { $sort: { _id: 1 } }
]),

// Monthly orders (last 12 months) — استبدل الـ aggregate الحالي:
Order.aggregate([
    {
        $match: {
            createdAt: { $gte: twelveMonthsAgo }
        }
    },
    {
        $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 },
        }
    },
    { $sort: { _id: 1 } }
]),
```

**ملاحظة:** أضف السطر `const twelveMonthsAgo = ...` قبل `Promise.allSettled` مباشرة، واستخدمه في الـ aggregate الثالث (monthlyRevenue) والرابع (monthlyOrders). احذف `{ $limit: 12 }` من كلاهما.

---

## TASK 2 — Fix recentOrders populate (add _id to select)
**ملف:** `backend/controllers/AdminController.js`

**المشكلة:** الـ populate على `recentOrders` ما بيجيب `_id` للـ user، بس `AdminOrderUser` في الفرونت بيتوقع `_id`.

**التعديل:** في نفس دالة `getAdminStats`، غيّر هاد السطر:
```js
// قبل:
.populate({ path: "user", select: "name email" })

// بعد:
.populate({ path: "user", select: "_id name email" })
```

---

## TASK 3 — Add status transition guard in orderMiddleware
**ملف:** `backend/middlewares/orderMiddleware.js`

**المشكلة:** الأدمن يقدر يحط status = `delivered` على طلب غير مدفوع، أو يرجع طلب ملغي.

**التعديل:** استبدل دالة `updateOrderStatusMiddleware` الحالية بالكود التالي:

```js
const updateOrderStatusMiddleware = async (req, res, next) => {
    const { status } = req.body;
    const CustomError = require("../utils/CustomError");
    const Order = require("../models/Order");

    const order = await Order.findById(req.params.id);
    if (!order) return next(new CustomError("No order found", 404));

    // Transition rules
    const VALID_TRANSITIONS = {
        pending:    ["processing", "cancelled"],
        processing: ["delivered", "cancelled"],
        delivered:  ["returned"],
        cancelled:  [],
        returned:   [],
    };

    const allowed = VALID_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(status)) {
        return next(
            new CustomError(
                `Cannot transition from "${order.status}" to "${status}"`,
                400
            )
        );
    }

    // Build payload
    const payload = { status };
    if (status === "delivered") {
        payload.isDelivered = true;
        payload.deliveredAt = Date.now();
    }
    if (status === "returned" || status === "cancelled") {
        payload.isDelivered = false;
        payload.deliveredAt = null;
    }

    req.body = payload;
    next();
};
```

**ملاحظة:** الدالة بقت `async`، لازم تضيف `try/catch` أو تربطها بـ `asyncErrorHandler`. الأبسط: غلّفها في `asyncErrorHandler` من `ErrorMiddleware`:

```js
const { asyncErrorHandler } = require("./ErrorMiddleware");

const updateOrderStatusMiddleware = asyncErrorHandler(async (req, res, next) => {
    // ... الكود فوق ...
});
```

---

## TASK 4 — Add loading.tsx for every admin page
**الملفات التي تنشئها (جديدة):**
- `frontend/app/(admin)/admin/loading.tsx`
- `frontend/app/(admin)/admin/orders/loading.tsx`
- `frontend/app/(admin)/admin/products/loading.tsx`
- `frontend/app/(admin)/admin/users/loading.tsx`
- `frontend/app/(admin)/admin/coupons/loading.tsx`
- `frontend/app/(admin)/admin/categories/loading.tsx`
- `frontend/app/(admin)/admin/brands/loading.tsx`

**المحتوى الموحد لكل ملف `loading.tsx`:**

```tsx
import LoadingSkeleton from "@/components/Admin/LoadingSkeleton";

export default function Loading() {
    return <LoadingSkeleton rows={10} />;
}
```

**ملاحظة:** ملف `frontend/app/(admin)/admin/loading.tsx` (الداشبورد الرئيسي) يستخدم كود مختلف قليلاً لأن الداشبورد فيه cards وcharts مش table:

```tsx
export default function Loading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-6 w-40 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-200 rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 rounded-xl" />
                <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 rounded-xl" />
                <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
        </div>
    );
}
```

---

## TASK 5 — Fix AdminOrdersClient status dropdown + complete action logic
**ملف:** `frontend/components/Admin/AdminOrdersClient.tsx`

**المشكلة 1:** الـ select dropdown يعرض فقط `["processing", "cancelled"]` مش كل الـ statuses الممكنة.

**المشكلة 2:** منطق إظهار الأزرار غير مكتمل — card orders اللي ما مرت على Stripe بتبقى stuck.

**التعديل — غيّر الجزء المسؤول عن الـ Actions column في الـ table:**

ابحث عن الكود الحالي في الـ Actions `<td>`:
```tsx
// قبل — الـ select options:
{[\"processing\", \"cancelled\"].map((s) => (
    <option key={s} value={s}>
        Mark {s}
    </option>
))}
```

استبدله بالكود التالي (مع منطق كامل للـ transitions):

```tsx
<td className="px-4 py-3">
    <div className="flex items-center gap-2">
        {/* Pay button: أي طلب غير مدفوع بغض النظر عن payment method */}
        {!order.isPaid && order.status !== "cancelled" && order.status !== "returned" && (
            <button
                type="button"
                disabled={actionId === order._id}
                onClick={() => setConfirm({ id: order._id, status: "paid" })}
                className="h-8 px-3 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
                {actionId === order._id ? "..." : "Pay"}
            </button>
        )}

        {/* Status dropdown — يعرض الـ transitions المنطقية للـ status الحالي */}
        {(() => {
            const TRANSITIONS: Record<string, string[]> = {
                pending:    ["processing", "cancelled"],
                processing: ["delivered", "cancelled"],
                delivered:  ["returned"],
                cancelled:  [],
                returned:   [],
            };
            const options = TRANSITIONS[order.status] ?? [];
            if (options.length === 0) return <span className="text-xs text-gray-400">--</span>;
            return (
                <select
                    value=""
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val) setConfirm({ id: order._id, status: val });
                        e.target.value = "";
                    }}
                    className="h-8 px-2 rounded-md border border-gray-300 text-xs bg-white cursor-pointer"
                >
                    <option value="" disabled>Change</option>
                    {options.map((s) => (
                        <option key={s} value={s}>
                            Mark {statusLabels[s] ?? s}
                        </option>
                    ))}
                </select>
            );
        })()}
    </div>
</td>
```

**ملاحظة:** احذف الكود القديم للـ Pay button و Status dropdown بالكامل واستبدله بالكود فوق. خلّي `ConfirmDialog` كما هو.

---

## TASK 6 — Add recentOrders table to admin dashboard page
**ملف:** `frontend/app/(admin)/admin/page.tsx`

**المشكلة:** الباك اند بيرجع `recentOrders` في الـ stats لكن الصفحة ما بتعرضها.

**التعديل:** أضف هاد الكود بعد آخر `<div className="grid ...">` في الـ return وقبل إغلاق الـ `<div className="space-y-6">`:

```tsx
{/* Recent Orders Table */}
{data.recentOrders && data.recentOrders.length > 0 && (
    <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Recent Orders</h2>
        <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                    <tr>
                        <th className="px-4 py-3 font-medium">Order ID</th>
                        <th className="px-4 py-3 font-medium">Customer</th>
                        <th className="px-4 py-3 font-medium">Total</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-gray-500">
                                #{order._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="px-4 py-3 text-gray-900">
                                {order.user?.name ?? "Unknown"}
                            </td>
                            <td className="px-4 py-3 font-medium">
                                ${order.totalOrderPrice?.toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                    {
                                        pending:    "bg-yellow-100 text-yellow-700",
                                        processing: "bg-blue-100 text-blue-700",
                                        delivered:  "bg-green-100 text-green-700",
                                        cancelled:  "bg-red-100 text-red-700",
                                        returned:   "bg-gray-100 text-gray-600",
                                    }[order.status] ?? "bg-gray-100 text-gray-600"
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                    month: "short", day: "numeric", year: "numeric"
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
)}
```

**ملاحظة:** الـ `AdminOrder` type موجود مسبقاً في `@/types/admin`. تأكد أن الـ import موجود في الملف أو أضفه:
```tsx
import type { AdminStats } from "@/types/admin";
```
(موجود مسبقاً، ما تحتاج تضيفه)

---

## TASK 7 — Fix AdminLayout profile fetch caching
**ملف:** `frontend/app/(admin)/layout.tsx`

**المشكلة:** `cache: "no-store"` بيعمل request جديد لكل navigation في الـ admin.

**التعديل:** غيّر هاد السطر:
```ts
// قبل:
const res = await fetch(`${API}/api/v1/users/myProfile`, {
    headers: { Cookie: `token=${token}` },
    cache: "no-store",
});

// بعد:
const res = await fetch(`${API}/api/v1/users/myProfile`, {
    headers: { Cookie: `token=${token}` },
    next: { revalidate: 300 }, // cache for 5 minutes
});
```

---

## TASK 8 — Fix duplicate cn() utility
**ملف:** `frontend/lib/adminUtils.ts`

**المشكلة:** `cn()` مكررة — موجودة هنا وفي `lib/utils.ts`.

**التعديل:** احذف دالة `cn` من `adminUtils.ts` واستبدلها بـ import:

```ts
// قبل:
export function parseError(err: unknown): string {
    if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        return axiosErr.response?.data?.message ?? "Something went wrong";
    }
    if (err instanceof Error) return err.message;
    return "Something went wrong";
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
}

// بعد:
export { cn } from "@/lib/utils";

export function parseError(err: unknown): string {
    if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        return axiosErr.response?.data?.message ?? "Something went wrong";
    }
    if (err instanceof Error) return err.message;
    return "Something went wrong";
}
```

**ملاحظة:** بعد هاد التعديل، تأكد أن `lib/utils.ts` تصدّر `cn` — لو ما كانت تصدّرها، أضف:
```ts
export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
}
```
لكن على الأغلب موجودة لأنها مستخدمة في مكان ثاني.

---

## TASK 9 — Fix AdminProductsClient image removal
**ملف:** `frontend/components/Admin/AdminProductsClient.tsx`

**المشكلة:** زر "Remove" للصورة بيمسح الـ state بس ما بيبعث للباك اند أي إشارة.

**التعديل 1:** أضف state جديد لتتبع حذف الصورة:
```tsx
// أضف هاد السطر مع باقي الـ useState في أول الـ component:
const [removeCover, setRemoveCover] = useState(false);
```

**التعديل 2:** غيّر دالة `resetForm`:
```tsx
const resetForm = () => {
    setForm(EMPTY_FORM);
    setCoverFile(null);
    setRemoveCover(false); // أضف هاد السطر
};
```

**التعديل 3:** في دالة `handleSave`، أضف هاد الكود بعد `fd.append("category", form.category)`:
```tsx
// إذا كان الأدمن ضغط Remove ومفيش ملف جديد
if (editing && removeCover && !coverFile) {
    fd.append("removeCoverImage", "true");
}
```

**التعديل 4:** غيّر `FileInput` في الـ JSX:
```tsx
// قبل:
<FileInput
    current={!creating && activeProduct ? activeProduct.coverImage : undefined}
    file={coverFile}
    onChange={setCoverFile}
    onRemove={() => setCoverFile(null)}
/>

// بعد:
<FileInput
    current={!creating && !removeCover && activeProduct ? activeProduct.coverImage : undefined}
    file={coverFile}
    onChange={(f) => { setCoverFile(f); if (f) setRemoveCover(false); }}
    onRemove={() => { setCoverFile(null); setRemoveCover(true); }}
/>
```

**التعديل 5 — الباك اند:** في `backend/controllers/ProductController.js`، في دالة الـ update أو في `Controller.js`، الباك اند لازم يقرأ `req.body.removeCoverImage`. هاد تعديل بسيط — أضف هاد الـ middleware قبل `updateOne` في `ProductRoutes.js`:

في `backend/controllers/ProductController.js` أضف دالة:
```js
const handleRemoveCoverImage = asyncErrorHandler(async (req, res, next) => {
    if (req.body.removeCoverImage === "true" || req.body.removeCoverImage === true) {
        req.body.coverImage = null; // أو string فاضية حسب الـ validation
        delete req.body.removeCoverImage;
    }
    next();
});
```
ثم أضفه في `backend/routes/ProductRoutes.js` في الـ PATCH route قبل `updateProduct`.

**ملاحظة مهمة:** لو الـ Product model عنده `required: true` على `coverImage`، غيّره لـ `required: false` أو خلّي المنطق يبقّي الصورة القديمة إذا ما جاء شي جديد (الأفضل هو البديل الثاني).

---

## ترتيب التنفيذ المقترح

```
TASK 1 → TASK 2 → TASK 3 → TASK 4 → TASK 5 → TASK 6 → TASK 7 → TASK 8 → TASK 9
```

Tasks 1-3 كلها backend، نفّذهم مع بعض.
Tasks 4-8 كلها frontend، نفّذهم مع بعض.
TASK 9 تمس backend وfrontend، نفّذها آخر شي.

---

## ملاحظات ختامية للـ OpenCode

1. **لا تعدّل** `Controller.js` (الـ generic controller) — كل التعديلات على الـ specific controllers والـ middlewares.
2. **لا تعدّل** الـ models إلا إذا طلب TASK 9 تعديل `required` على `coverImage`.
3. بعد كل task، تأكد أن TypeScript ما عنده errors جديدة — خصوصاً TASK 5 وTASK 6.
4. **الـ pagination الشاملة** (server-side) مش في هاد الـ plan — هي تحسين مستقبلي أكبر حجمًا.
