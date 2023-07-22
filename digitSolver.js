const resultsUL = document.getElementById("results")

let solver = (arr, target, solNum) => {
    /**
     * given array of 6 numbers, 
     * and a target int
     * returns the solution for the NYTimes Digits game
     * returns -1 in case of failure
     */
    let success = 0
    for (subset of shuffle(allSubSets(arr))){
        for (perm of allPerms(subset)){
            // each perm only gives at most 5 answers
            // let successForThisPerm = 0
            const operations = allOperations(perm)

            for (op of operations){
                let res = evaluate(op)
                if (res === target && Number.isInteger(res)){
                    let regular = postfixToRegular(op)

                    const resultsOl = document.getElementById('results');
                    const lastExp = resultsOl.lastElementChild;
                    
                    if (lastExp && lastExp.textContent == regular) continue

                    const newLi = document.createElement("li")
                    newLi.textContent = regular
                    resultsUL.appendChild(newLi)

                    success++
                    // successForThisPerm++
                }
                
                if (success >= solNum) break

            }
            if (success >= solNum) break
        }
        if (success >= solNum) break

                //////////
                // for (op of operations){
                //         let res = evaluate(op)
                //         // forcing the HTML element to update each loop
                //         if (res === target && Number.isInteger(res)){
                //             let regular = postfixToRegular(op)

                //             const newLi = document.createElement("li")
                //             newLi.textContent = regular
                //             resultsUL.appendChild(newLi)
                //             Window.length
                //             console.log(`${regular}`); // SIDE EFFECT: prints out op as it goes
                            
                //         }
                //             // sols.push(op) 
                //             // pushing the solutions to sols makes it RUN OUT OF MEMORY!
                //         // you can't actually break out of forEach loop
                //         // TODO figure out a better looping mechanism that can be broken out of easily
                //     }
                /////////
                
        }
    return
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
        if (sign === "-" && typeof arr[idx-2] === "number" 
            && typeof arr[idx-1] === "number" 
            && arr[idx-2] <= arr[idx-1] || 

            sign === "/" && typeof arr[idx-2] === "number" 
            && typeof arr[idx-1] === "number" 
            && arr[idx-2]%arr[idx-1] !== 0){
                continue
            }
        
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

let postfixToRegular = (postfix) => {
    /**
     * @param postfix array of numbers and strings
     * that are ["+","-","*","/"]. E.g. [4,2,"+",9,"*"]
     * @return regular String of a regular mathematic 
     * expression. E.g. "(4+2)*9"
     */
    const stack = []
    for (el of postfix){
        if (typeof el === "string"){
            if (stack.length < 2){
                return ""
            }
            let operand2 = stack.pop()
            let operand1 = stack.pop()
            if (el === "+"){
                stack.push(`${operand1}+${operand2}`)
            }
            else if (el === "-"){
                if (operand2.includes("+") || operand2.includes("-")){
                    operand2 = `(${operand2})`
                }
                stack.push(`${operand1}-${operand2}`)
            }
            else if (el === "*"){
                // adding parentheses if the operand
                // is an expression. For this reason, 
                // no number in the arr should be more than
                // 2 digits long.
                if (operand1.includes("+") || operand1.includes("-")){
                    operand1 = `(${operand1})`
                }
                if (operand2.includes("+") || operand2.includes("-")){
                    operand2 = `(${operand2})`
                }
                
                stack.push(`${operand1}*${operand2}`)
            }
            else{ // DIVISION CASE
                if (operand1.includes("+") 
                 || operand1.includes("-")
                 || operand1.includes("*")
                 || operand1.includes("/")
                 ){
                    operand1 = `(${operand1})`
                }
                if (operand2.includes("+") 
                 || operand2.includes("-")
                 || operand2.includes("*")
                 || operand2.includes("/")
                 ){
                    operand2 = `(${operand2})`
                }
                stack.push(`${operand1}/${operand2}`)
            }
        }

        else{ 
            stack.push((el).toString())
        }
    }
    if (stack.length === 1)
        return stack[0]
    return "ERROR: stack size greater than 1 at the end"

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

let handleSubmitButton = () => {
    // cleaning up
    while (resultsUL.firstElementChild){
        resultsUL.firstElementChild.remove()
    }
    document.getElementById("runtime-warning").textContent = ""
    document.getElementById("errors").textContent = ""
    
    // getting user input
    const numArrText = document.getElementById('arr-input').value
    const targetText = document.getElementById("target-input").value
    
    const numArr = numArrText.split(",").map(el => Number.parseInt(el))
    const target = Number.parseInt(targetText)

    const numSolText = document.getElementById("solution-number-input").value
    const numSol = Number.parseInt(numSolText)
    
    if (numArr.length > 6 || numArr.length < 1){
        handleError("Array size must be between 1 and 6")
        return
    }
    // solving and appending li's

    solver(numArr, target, numSol)
    if (resultsUL.childElementCount === 0){
        const noResultMessage = document.createElement("li")
        noResultMessage.textContent = "No solutions found"
        resultsUL.appendChild(noResultMessage)
        document.getElementById("runtime-warning").textContent = "Due to the computation load it may take up to 1 minute for the results to show up"
    }
    document.getElementById("runtime-warning").textContent = ""

    return
}

let shuffle = array => {
    /**
     * Stolen from 
     * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     */
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

let handleError = (message) => {
    const errorDiv = document.getElementById("errors")
    errorDiv.textContent = `ERROR: ${message}`
}

// console.log(solver([3,11,31,40,47],203))
// console.log(evaluate([1,2,"+",49,"-",19,"-",30,49,"*","-"]));