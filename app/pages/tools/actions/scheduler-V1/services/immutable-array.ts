/**
 * https://vincent.billey.me/pure-javascript-immutable-array/ 
 */
// ES2015

export class ImmutableArray {
    static push(arr, newEntry) {
        return [...arr, newEntry]
    }

    static delete(arr, index) {
        return arr.slice(0, index).concat(arr.slice(index + 1))
    }

    /**
     * arr = Main Data list
     * newEntry = For entry 
     * index = For replace index
     */
    static replace(arr, newEntry, index) {
        arr[index] = newEntry;
        return arr.slice();
    }

    static unshift(arr, newEntry) {
        return [newEntry, ...arr]
    }

    static splice(arr, start, deleteCount, ...items) {
        return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)]
    }
}