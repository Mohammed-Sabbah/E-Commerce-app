"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { apiClient } from "@/lib/apiClient";
import { parseError } from "@/lib/adminUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Product, Category, Brand, PopulatedRef } from "@/types/api";

interface FormState {
    name: string;
    description: string;
    price: string;
    priceAfterDiscount: string;
    quantity: string;
    category: string;
    brand: string;
    colors: string;
}

const EMPTY_FORM: FormState = {
    name: "", description: "", price: "", priceAfterDiscount: "",
    quantity: "1", category: "", brand: "", colors: "",
};

function refId(v: PopulatedRef | string | null | undefined): string {
    if (!v) return "";
    return typeof v === "string" ? v : v._id;
}

function FileInput({ current, file, onChange, onRemove, t }: {
    current?: string;
    file: File | null;
    onChange: (f: File | null) => void;
    onRemove: () => void;
    t: (key: string, params?: Record<string, string | number | Date>) => string;
}) {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <div className="flex items-center gap-2">
            <input ref={ref} type="file" accept="image/*" onChange={(e) => onChange(e.target.files?.[0] ?? null)} className="hidden" />
            <button type="button" onClick={() => ref.current?.click()} className="h-8 px-3 rounded-md border border-gray-300 text-xs text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                {t('chooseImage')}
            </button>
            {file ? (
                <span className="text-xs text-blue-600">{file.name}</span>
            ) : current ? (
                <span className="text-xs text-gray-500">{t('currentFile', { name: current.split("/").pop() ?? "" })}</span>
            ) : (
                <span className="text-xs text-gray-400">{t('noFileChosen')}</span>
            )}
            {(file || current) && (
                <button type="button" onClick={() => { if (file) onRemove(); else if (current) onRemove(); }} className="text-xs text-red-500 hover:text-red-700 underline cursor-pointer">
                    {t('imageRemove')}
                </button>
            )}
        </div>
    );
}

function MultiImageInput({ files, existing, onChange, onRemoveExisting, t }: {
    files: File[];
    existing: string[];
    onChange: (files: File[]) => void;
    onRemoveExisting: (url: string) => void;
    t: (key: string, params?: Record<string, string | number | Date>) => string;
}) {
    const ref = useRef<HTMLInputElement>(null);

    const handleAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []);
        const total = files.length + existing.length + selected.length;
        if (total > 5) {
            toast.error(t('maxImagesError'));
            return;
        }
        onChange([...files, ...selected]);
        if (ref.current) ref.current.value = "";
    };

    const removeNew = (index: number) => {
        onChange(files.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {existing.map((url, i) => (
                    <div key={`ex-${i}`} className="relative w-14 h-14 rounded-md overflow-hidden border border-gray-200 group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => onRemoveExisting(url)}
                            className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                {files.map((file, i) => (
                    <div key={`new-${i}`} className="relative w-14 h-14 rounded-md overflow-hidden border border-blue-200 group">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeNew(i)}
                            className="absolute inset-0 bg-black/50 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                {(files.length + existing.length) < 5 && (
                    <button
                        type="button"
                        onClick={() => ref.current?.click()}
                        className="w-14 h-14 rounded-md border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors text-xl flex items-center justify-center cursor-pointer"
                    >
                        +
                    </button>
                )}
            </div>
            <input ref={ref} type="file" accept="image/*" multiple onChange={handleAdd} className="hidden" />
            <p className="text-xs text-gray-400">{t('imagesCount', { count: files.length + existing.length })}</p>
        </div>
    );
}

interface Props {
    open: boolean;
    onClose: () => void;
    product: Product | null;
    categories: Category[];
    brands: Brand[];
}

export default function ProductFormModal({ open, onClose, product, categories, brands }: Props) {
    const t = useTranslations('admin');
    const queryClient = useQueryClient();
    const dialogRef = useRef<HTMLDialogElement>(null);
    const editing = !!product;

    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [extraFiles, setExtraFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [removingCover, setRemovingCover] = useState(false);

    useEffect(() => {
        const el = dialogRef.current;
        if (!el) return;
        if (open) {
            el.showModal();
            if (product) {
                setForm({
                    name: product.name,
                    description: product.description,
                    price: String(product.price),
                    priceAfterDiscount: product.priceAfterDiscount ? String(product.priceAfterDiscount) : "",
                    quantity: String(product.quantity),
                    category: refId(product.category),
                    brand: refId(product.brand),
                    colors: (product.colors ?? []).join(", "),
                });
                setCoverFile(null);
                setExtraFiles([]);
                setExistingImages(product.images ?? []);
            } else {
                setForm(EMPTY_FORM);
                setCoverFile(null);
                setExtraFiles([]);
                setExistingImages([]);
            }
        } else {
            el.close();
        }
    }, [open, product]);

    useEffect(() => {
        const el = dialogRef.current;
        if (!el) return;
        const handleClose = () => onClose();
        el.addEventListener("close", handleClose);
        return () => el.removeEventListener("close", handleClose);
    }, [onClose]);

    const descError = form.description.trim() && form.description.trim().length < 20;

    const validatePrice = (): string | null => {
        const price = Number(form.price);
        const discount = Number(form.priceAfterDiscount);
        if (form.priceAfterDiscount && discount >= price) {
            return t('discountPriceError');
        }
        return null;
    };

    const saveMutation = useMutation({
        mutationFn: async () => {
            const priceErr = validatePrice();
            if (priceErr) throw new Error(priceErr);
            if (descError) throw new Error(t('descriptionMinLength'));

            const fd = new FormData();
            fd.append("name", form.name);
            fd.append("description", form.description);
            fd.append("price", form.price);
            fd.append("quantity", form.quantity);
            fd.append("category", form.category);
            if (form.brand) fd.append("brand", form.brand);
            if (form.priceAfterDiscount) fd.append("priceAfterDiscount", form.priceAfterDiscount);
            if (form.colors.trim()) {
                form.colors.split(",").map(c => c.trim()).filter(Boolean).forEach((c) => fd.append("colors", c));
            }
            if (coverFile) fd.append("coverImage", coverFile);
            extraFiles.forEach((f) => fd.append("images", f));
            fd.append("existingImages", JSON.stringify(existingImages));

            if (editing) {
                await apiClient.patch(`/api/v1/products/${product!._id}`, fd);
            } else {
                if (!coverFile) throw new Error(t('coverImageRequired'));
                await apiClient.post("/api/v1/products", fd);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
            toast.success(t('productSaved'));
            onClose();
        },
        onError: (e: unknown) => toast.error(parseError(e)),
    });

    const handleRemoveCover = async () => {
        if (!product) return;
        setRemovingCover(true);
        try {
            await apiClient.patch(`/api/v1/admin/products/${product._id}/remove-cover`);
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
        } catch (e: unknown) {
            toast.error(parseError(e));
        } finally {
            setRemovingCover(false);
        }
    };

    if (!open) return null;

    return (
        <dialog
            ref={dialogRef}
            className="fixed inset-0 z-50 m-auto w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 backdrop:bg-black/40 p-0 open:animate-in fade-in-0 zoom-in-95"
            onClick={(e) => { if (e.target === dialogRef.current) onClose(); }}
        >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                    {editing ? t('editProduct') : t('addProduct')}
                </h2>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none cursor-pointer transition-colors">&times;</button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t('productName')}</label>
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t('productName')} className="h-9 px-3 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t('productPrice')}</label>
                        <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder={t('productPrice')} type="number" className="h-9 px-3 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t('discountedPrice')}</label>
                        <input value={form.priceAfterDiscount} onChange={(e) => setForm({ ...form, priceAfterDiscount: e.target.value })} placeholder={t('discountedPrice')} type="number" className="h-9 px-3 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t('productQuantity')}</label>
                        <input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder={t('productQuantity')} type="number" className="h-9 px-3 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t('productCategory')}</label>
                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-9 px-3 border border-gray-200 rounded-lg text-sm bg-white w-full focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all">
                            <option value="">{t('selectCategory')}</option>
                            {categories.map((c) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t('productBrand')}</label>
                        <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="h-9 px-3 border border-gray-200 rounded-lg text-sm bg-white w-full focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all">
                            <option value="">{t('selectBrand')}</option>
                            {brands.map((b) => (<option key={b._id} value={b._id}>{b.name}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{t('productColors')}</label>
                        <input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} placeholder={t('colorsPlaceholder')} className="h-9 px-3 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{t('productDescription')}</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder={t('descriptionPlaceholder')} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition-all resize-none" />
                    {descError && <p className="text-xs text-red-500 mt-1">{t('descriptionMinLength')}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">{t('productCover')}</label>
                    <FileInput
                        t={t}
                        current={editing ? product!.coverImage : undefined}
                        file={coverFile}
                        onChange={setCoverFile}
                        onRemove={() => {
                            if (coverFile) setCoverFile(null);
                            else if (editing) handleRemoveCover();
                        }}
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">{t('additionalImages')}</label>
                    <MultiImageInput
                        t={t}
                        files={extraFiles}
                        existing={existingImages}
                        onChange={setExtraFiles}
                        onRemoveExisting={(url) => setExistingImages(existingImages.filter((u) => u !== url))}
                    />
                </div>
            </div>

            <div className="flex justify-end items-center gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
                <button type="button" onClick={onClose} className="h-9 px-4 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-white transition-colors cursor-pointer">
                    {t('cancel')}
                </button>
                <button
                    type="button"
                    onClick={() => saveMutation.mutate()}
                    disabled={!form.name || !form.price || saveMutation.isPending}
                    className="h-9 px-5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-40 transition-all cursor-pointer flex items-center gap-1.5"
                >
                    {saveMutation.isPending && (
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                    )}
                    {saveMutation.isPending ? t('saving') : editing ? t('editProduct') : t('addProduct')}
                </button>
            </div>
        </dialog>
    );
}
