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
                stack.push(`(${operand1}+${operand2})`)
            }
            else if (el === "-"){
                stack.push(`(${operand1}-${operand2})`)
            }
            else if (el === "*"){
                stack.push(`${operand1}*${operand2}`)
            }
            else{
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

console.log(postfixToRegular([
    7, 11,  20,  '*', 4,
    5, '+', '-', '+'
  ]));

export default postfixToRegular;