const showedPages = []
let contents = [["レビュー内容", "バージョン", "レーティング"]]
function tapped() {
    if (document.getElementById('text-input').value == '') {
        PNotify.notice('IDが入力されていない、もしくはローマ字が含まれています。');
        const objact = document.getElementById("output-page-number")
        objact.value = 1
        return
    }
    try {
        const objact = document.getElementById("output-page-number")
        getReview(objact.value)
        objact.value = Number(objact.value) + 1
    } catch (error) {
        console.log(error)
        PNotify.notice('不明なエラーが発生しました。')
    }
}
async function getReview(page) {
    const id = document.getElementById("text-input").value;
    const url = 'https://itunes.apple.com/jp/rss/customerreviews/page=' + page + '/id=' + id + '/json';
    console.log(url)
    const response = await fetch(url, { mode: 'cors' })
    const count = document.getElementById("output-page-number").value
    try {
        const json = await response.json()
        const entry = json.feed.entry
        if (entry == undefined) {
            PNotify.notice('IDが無効です。');
            const objact = document.getElementById("output-page-number")
            objact.value = 1
            return
        } else if (showedPages.includes(count)) {
            PNotify.notice('このページは一度取得したため追加することができません。')
            return
        }
        entry.forEach(function(value) {
            contents.push([value.content.label, value['im:version'].label, value['im:rating'].label])
            result.innerHTML += value.content.label + "<br/><br/>"
        })
        showedPages.push(count)
        makeCSV()
    } catch (error) {
        console.log(error)
        PNotify.notice('なんらかのエラーが発生したため正常に取得できませんでした。')
    }
}

function makeCSV() {
    let csvData = "data:text/csv;charset=utf-8,"
    contents.forEach(function(rows) {
        const row = rows.join(",")
        csvData += row + "\r\n"
    })
    const encodeUri = encodeURI(csvData)
    const link = document.getElementById("download-csv")
    link.setAttribute("href", encodeUri)
    link.setAttribute("download", "csvdata.csv")
}