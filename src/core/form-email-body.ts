export const formEmailBody = (body: {name: string, value: string | number}[]): {body: string} => {
    return {body: '<h2>Заявка</h2>\n' + body.map(row => `<p><b>${row.name}:</b> ${row.value}</p>`).join('\n')}
}
