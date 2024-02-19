// THIS FUNCTION ONLY WORKS WITH INPUT FROM FIREBASE
export function getGlobalPercentage(input) {
    if(input.length > 0){
        let percentages = []
        input.map((item) => {
            const perc = item.makes / item.attempts;
            percentages.push(perc.toFixed(2)*100);
        })

        let sum = 0
        percentages.forEach((i) => {
            sum += i;
        })

        const globalPercentage = (sum / percentages.length).toFixed(2)
        return globalPercentage;
    } else {
        return 0;
    }
}


function sortAllByDate(input) {
    const sort = [...input].sort((a,b) => a.date.getTime() - b.date.getTime())
    return sort
}

// TAKES INPUT OBJECT: {date: Date(), value: x}

export function filterByXMonth(input, x) {
    const date = new Date();
    date.setDate(date.getDate()-x*30);
    
    const res = input.filter((obj) => obj.date >= date);
    // console.log(res);
    // console.log("dates within past " + x + " month(s)")
    return res;
}


// TAKES INPUT OBJECT: {date: Date(), value: x}

export function filterByXWeek(input, x) {
    const date = new Date();
    date.setDate(date.getDate()-7*x);
    
    const res = input.filter((obj) => obj.date >= date);
    // console.log(res);
    // console.log("dates within past " + x + " week(s)")
    return res;
}

// TAKES INPUT OBJECT: {date: Date(), value: x}

export function getLabels(input){
    let res = []
    input.map((item) => {
        res.push(item.date);
    })
    return res;
}
// TAKES INPUT OBJECT: {date: Date(), value: x}

export function getData(input){
    let res = []
    input.map((item) => {
        res.push(item.value);
    })
    return res;
}

// TAKES INPUT OBJECT: {date: Date(), value: x}

export function getPercentage(input) {
    counter = 0
    sum = 0
    input.map((item) => {
        sum += item.value;
        counter += 1;
    })

    return (sum / counter).toFixed(2)
}

// // TAKES INPUT OBJECT: {date: Date(), value: x}

// export function calculatePercChange(input) {
//     const currPerc = getPercentage(input);
//     const date = new Date();
//     date.setDate(date.getDate()-7);
//     const res = input.filter((obj) => obj.date <= date);

//     const oldPerc = getPercentage(res);
//     console.log(currPerc)
//     console.log(oldPerc)


//     console.log(currPerc - oldPerc);
//     return (currPerc-oldPerc).toFixed(2)
// }





export function convertUserData(input){
    if(input.length > 0) {
        let res = []
        input.map((item) => {
            const converted = item.date.seconds*1000 + Math.floor(item.date.nanoseconds / 1e6);
            const convertedDate = new Date(converted)
            convertedDate.setHours(0,0,0,0)
            const calculation = item.makes / item.attempts
            x = {
                date:convertedDate,
                // date: new Date(convertedDate.getFullYear(), convertedDate.getMonth(), convertedDate.getDate()), 
                value:calculation.toFixed(2)*100
            }
            res.push(x);
        })
        return sortAllByDate(res);
    } else {
        return {
            date: new Date(new Date(2000, 0, 1).getTime() + 1000 * 60 * 60 * 24 * 0),
            value: 0
        };
    }
}