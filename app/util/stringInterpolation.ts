/**
 * @param s a string like 'Hello {name}'
 * @param replacers an object like { name: 'John' }
 * @returns string 'Hello John'
 */
export const replaceMulti = (s: string, replacers: { [key: string]: string | null | undefined }): string => {
    Object.keys(replacers).forEach((key: string) => {
        const value = replacers[key];
        if (value !== null && value !== undefined) {
            s = s.replace(new RegExp(`{${key}}`, 'g'), value);
        }
    });
    return s;
}