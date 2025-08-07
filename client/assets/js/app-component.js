

document.addEventListener('DOMContentLoaded', ()=> {
    const max = 10;
    const barsContainer = document.getElementById('bars');
    const range = document.getElementById('range');
    const filterTab = document.querySelector('.filter-tab');
    const maxPriceInput = document.querySelector('#max-price');

    let rangeValue = range.value;
    maxPriceInput.value = rangeValue
    
    //create filter bars
    for (let i = 0; i < max; i++) {
        const bar = document.createElement('div');
        const noOfColored = Math.floor(parseInt(rangeValue)/30); 
        bar.classList.add('bar');
        const h = (i + 1) * 10;
        if(i < noOfColored) {
            bar.classList.add('filled');
        }
        bar.style.height = `${h}%`
        barsContainer.appendChild(bar);
    }

    //grab all bars
    const bars = document.querySelectorAll('.bar');


    //add event listeners on the filter tab for both textbox(input) and range(change)
    filterTab.addEventListener('input', filterTabListener);
    filterTab.addEventListener('change', filterTabListener);

    //event delegation function
    function filterTabListener(e){
        if(!e.target.matches('input')) return;

        if(e.type === "input" && e.target.matches('.slider')){
            rangeValue = e.target.value;
            let value = Math.floor(parseInt(rangeValue)/30);
            maxPriceInput.value = rangeValue

            for(let i = 0; i<bars.length; i++){
               bars[i].classList.remove('filled')
            }

            for(let i = 0; i<value; i++){
                bars[i].classList.add('filled')
            }

            console.log(`${e.target} is now at ${e.target.value}`)
        }
    }
    
})

