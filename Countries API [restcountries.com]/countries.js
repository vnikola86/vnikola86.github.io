const tableBody = document.querySelector("tbody");


fetch("https://restcountries.com/v2/all")
.then(res => res.json())
.then(data => makeTable(data, tableBody))
.catch(err => console.log("Error:", err));


const formatRow = (row) => {

    row.style.display = 'grid';
    row.style.gridTemplateColumns = '10% 25% 10% 20% 20% 15%';
    row.style.width = '100%';
    row.style.borderCollapse = 'collapse'
}

class CountryRow {

    constructor(country,i) {
        this.row = `<tr><td>${i+1}</td>
        <td>${country.name}</td>
        <td>${country.alpha2Code}</td>
        <td>${country.capital || "-"}</td>
        <td><img src="${country.flag}" /></td>
        <td>${country.population.toLocaleString('sr-Latn-ME')}</td></tr>`
    }

    get() { return this.row }
}


const makeTable = (data, table) => {

    table.innerHTML = data.map((country, i) => {
                                let cr = new CountryRow(country,i);
                                return cr.get() }).join('');

    const tableRows = table.querySelectorAll('tr');

    tableRows.forEach((row) => { formatRow(row) })
}


const searchForm = document.forms['search-country']


searchForm.addEventListener('keyup', (event) => {

    let textInput = searchForm.querySelector("input[type='text']");
    let value = textInput.value.toLowerCase();


    const countries = tableBody.querySelectorAll('tr');

    countries.forEach((country) => { 

        if (country.children[1].textContent.toLowerCase().includes(value) || country.children[3].textContent.toLowerCase().includes(value)) {

            formatRow(country)
        }
        else {

            country.style.display = 'none'}
  })
})
