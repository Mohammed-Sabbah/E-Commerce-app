exports.parseDuration = function(duration) {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error('Invalid duration format');
  }
  
  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch(unit) {
    case 's': return value * 1000;                 // seconds to ms
    case 'm': return value * 60 * 1000;            // minutes to ms
    case 'h': return value * 60 * 60 * 1000;       // hours to ms
    case 'd': return value * 24 * 60 * 60 * 1000;  // days to ms
    default: throw new Error('Invalid time unit');
  }
}
