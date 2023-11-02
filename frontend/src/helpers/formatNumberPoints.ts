const formatNumberWithPoints = (num: number): string => {
  if (!isNaN(num)) {
    const numStr = num.toFixed(2); // Limitar a 2 decimales
    const parts = numStr.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  } else return '';
};

export default formatNumberWithPoints;
