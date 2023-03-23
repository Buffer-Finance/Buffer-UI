function sort(arr) {
    arr.sort(function (a, b) { return a - b })
    console.log(arr)
}

sort([3, 2, 1, 4, 45, 5])