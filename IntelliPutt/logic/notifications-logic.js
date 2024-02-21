
// Takes input ZippedData which has structure: [[{from: ..., status: ..., timestamp: ..., to: ...}, documentId], [....]]

export function filterUnseenNotifs(data) {
    console.log("data input", data);
    let res = []
    data.map((req) => {
        if(req[0].status == "pending") {
            res.push(req)
        }
    })
    console.log("data output",res);
    return res;
}
// Takes input ZippedData which has structure: [[{from: ..., status: ..., timestamp: ..., to: ...}, documentId], [....]]
export function filterSeenNotifs(data) {
    let res = []
    data.map((req) => {
        if(req[0].status == "accepted" || req[0].status == "ignored"){
            res.push(req);
        }
    })
    return res;
}

    
