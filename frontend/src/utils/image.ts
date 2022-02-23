// Retunrs number of MB in given file
export const getMb = (f: File): number => f.size / 1024 / 1024

// Converts a file to a base64 string. Calls given callback function with the result as the parameter when finished
export const convertToBase64 = (f: File, callback: (res: string) => void): void => {
    const reader = new FileReader()
    reader.onloadend = (e) => {
        callback(e.target ? e.target.result as string : '')
    }
    reader.readAsDataURL(f as Blob)
}
