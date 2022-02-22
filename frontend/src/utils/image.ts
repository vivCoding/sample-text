export const getMb = (f: File): number => f.size / 1024 / 1024

export const convertToBase64 = (f: File, callback: (res: string) => void): void => {
    const reader = new FileReader()
    reader.onloadend = (e) => {
        callback(e.target ? e.target.result as string : '')
    }
    reader.readAsDataURL(f as Blob)
}
