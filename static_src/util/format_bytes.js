/*
 * Formats bytes to largest unit where scalar is still a whole number.
 *
 * @params {Number} bytes
 * @params {Number} decimals number of decimal places to format
 * @returns {String} Formatted byte value with unit eg. 1.3 MB
 **/
export default function formatBytes(bytes, decimals = 0) {
  if (bytes === 0) return `${bytes.toFixed(decimals)} Bytes`;
  const k = 1000;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i))).toFixed(decimals)} ${sizes[i]}`;
}
