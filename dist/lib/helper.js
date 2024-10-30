export function filterUniqueContacts(contacts) {
    const uniqueIds = new Set();
    return contacts.filter((contact) => {
        if (!uniqueIds.has(contact.id)) {
            uniqueIds.add(contact.id);
            return true;
        }
        return false;
    });
}
export function hideEmailIDs(contacts, userId) {
    if (userId === undefined) {
        throw new Error('User ID is required');
    }
    console.log(userId);
    return contacts.map((contact) => (Object.assign(Object.assign({}, contact), { email: String(userId) === String(contact.userId) ? contact.email : null })));
}
export function formatResults(contacts, userId) {
    let result = filterUniqueContacts(contacts);
    result = hideEmailIDs(result, userId);
    return result;
}
