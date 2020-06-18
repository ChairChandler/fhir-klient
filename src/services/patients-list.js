import serverInfo from 'src/config/server.json'

export const PatientsListService = {
    download: async () => {
        const bs = await fetch(`http://${serverInfo.ip}:${serverInfo.port}/patients_list`)
        const data = await bs.json()
        const cols = []
        for (const field in data[0]) {
            const firstLetter = field[0].toUpperCase()
            const rest = field.slice(1).toLocaleLowerCase()
            cols.push({ title: `${firstLetter}${rest}`, field: field, customFilterAndSearch: (term, row) => row.lastname.includes(term) })
        }
        return { cols, data }
    }
}