

export default function reqInit(method = "POST", bearer_token = "", body = "") {

    if(typeof body === 'object') {
        body = JSON.stringify(body)
    }

    if(body !== "" && body !== undefined) {
        return {
            method: method,
            headers: { 
                'Accept':'application/json',
                'Authorization': `${bearer_token}`,
                'Content-Type': 'application/json'
            },
            // credentials: 'include',
            mode: "cors",
            cache: "default",
            body: body
        }
    }
    else {
        return {
            method: "GET",
            headers: { 
                'Accept':'application/json',
                'Authorization': `${bearer_token}`,
                'Content-Type': 'application/json'
            },
            mode: "cors",
            cache: "default"
        }
    }
}