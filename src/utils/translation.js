
export function translateStudent(key) {
    const translations = {
        studentPhoto: "Student Photo",
        // other keys...
    };

    return translations[key] || key;
}
