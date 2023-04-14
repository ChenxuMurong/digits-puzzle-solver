let solver = (arr, target) => {
    /**
     * given array of 6 numbers, 
     * and a target int
     * returns the solution for the NYTimes Digits game
     * returns -1 in case of failure
     */
    const sols = []
    allSubSets(arr).forEach(
        subset => {
            allPerms(subset).forEach(perm => {
                // console.log(element);
                allOperations(perm).forEach(
                    op => {
                        let res = evaluate(op)
                        if (res === target && Number.isInteger(res))
                            sols.push(op)
                        // you can't actually break out of forEach loop
                        // TODO figure out a better looping mechanism that can be broken out of easily
                    }
                )
            });
        });
    return sols
}

let allSubSets = (arr) => {
    /**
     * @return list of lists, all subsets of arr
     * whose length >= 2
     */

    const ans = [[]]
    for (let i = 0; i < arr.length; i++){
        let ansLength = ans.length
        for (let j = 0; j < ansLength; j++){
            const newList = [...ans[j], arr[i]]
            // console.log(newList);
            ans.push(newList)
        }
    }
    return ans.filter(
        subset => subset.length >= 2
    )
}

let allPerms = (arr) => {
    /**
     * returns all permutations of arr
     * in the form of a [[]]
     */
    if (arr.length <= 1)
        return [arr]

    const ans = []
    for (let i = 0; i < arr.length; i++){
            // swapping first item with ith item
            let temp = arr[0]
            arr[0] = arr[i]
            arr[i] = temp
            
            ans.push(
                ...allPerms(arr.slice(1)).map( 
                        // add arr[0] to every sub-permutation
                        permArr => [arr[0],...permArr]
                    )
                )
            // unswapping them (backtracking)
            let temp2 = arr[0]
            arr[0] = arr[i]
            arr[i] = temp2

    }
    return ans
}

let allOperations = (arr) => {
    /**
     * ARR.LENGTH >= 2
     * returns all possible operations with this arr
     * in reverse polish notation
     * e.g. [1,2,3] => [1,2,"*",3,"+","-"], ......
     */
    return allOperationsAux(arr, 2, arr.length - 1)
}

let allOperationsAux = (arr, idx, signsLeft) => {
    /**
     * arr is being modified in recursive calls
     * idx points to the place to insert a sign
     */
    // console.log("arr=",arr, " idx=", idx, " ", signsLeft, " signs left");
    const ans = []

    if (signsLeft === 0)
        return [arr]

    // adding no sign here, just skips to the next idx
    if (idx < arr.length){
        ans.push(...allOperationsAux(arr, idx + 1, signsLeft))
    }

    // start adding any of the four signs
    for (sign of ["+","-","*","/"]){
        // check eligibility
        if (sign === "-" && arr[idx-2] instanceof Number && arr[idx-1] instanceof Number && arr[idx-2] <= arr[idx-1] || 
            sign === "/" && arr[idx-2] instanceof Number && arr[idx-1] instanceof Number && arr[idx-2]%arr[idx-1] !== 0)
            continue
        
        arr.splice(idx, 0, sign) // insert at idx
        ans.push(...allOperationsAux(arr.slice(0,arr.length), idx + 1, signsLeft - 1))
        arr.splice(idx, 1) // delete the sign we inserted
    }
    return ans
}

let evaluate = (arr) => {
    let stack = []
    for (el of arr){
        // console.log(typeof el);
        if (typeof el === "string"){

            if (stack.length < 2){
                return -1
            }
            let operand2 = stack.pop()
            let operand1 = stack.pop()
            if (el === "+"){
                stack.push(operand1 + operand2)
            }
            else if (el === "-"){
                if (operand1 <= operand2) return -1
                stack.push(operand1 - operand2)
            }
            else if (el === "*"){
                stack.push(operand1 * operand2)
            }
            else{
                if (operand1 % operand2 !== 0) return -1
                stack.push(operand1 / operand2)
            }
        }

        else{ 
            stack.push(el)
        }
    }
    // console.log(stack);
    if (stack.length === 1)
        return stack.pop()
    else return -1

}


// allOperations([1,2,3,4]).forEach(element => {
//     console.log(element)
// });;

// allSubSets([3,5,9,20,23,25]).forEach(
//     subset => {
//         allPerms(subset).forEach(perm => {
//             // console.log(element);
//             allOperations(perm).forEach(
//                 op => {
//                     let res = evaluate(op)
//                     if (res === 388 && Number.isInteger(res))
//                         console.log(op, res)
//                     // you can't actually break out of forEach loop
//                     // TODO figure out a better looping mechanism that can be broken out of easily
//                 }
//             )
//         });
//     });

console.log(solver([3,5,9,20,23,25],388))
// console.log(evaluate([1,2,"+",49,"-",19,"-",30,49,"*","-"]));