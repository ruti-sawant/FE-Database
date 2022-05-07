
//supporting functions 
//to build query out of request query.
export function builtProjection(object) {
    for (let attribute in object) {
        if (object[attribute] === '1') {
            object[attribute] = 1;
        } else {
            delete object[attribute];// if value is not 1 then consider that query parameter as invalid
        }
    }
    return object;
}