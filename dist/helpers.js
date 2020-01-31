"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escapeXml(string) {
    return String(string).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
exports.escapeXml = escapeXml;
;
