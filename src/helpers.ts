export function escapeXml (string) {
    return String(string).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};
