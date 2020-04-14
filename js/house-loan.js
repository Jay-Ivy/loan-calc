/**
 * 房贷计算器
 * @param {float} comLoanAmount 商业贷款金额(百万)
 * @param {float} resLoanAmount 公积金贷款金额(百万)
 * @param {float} comRate 商业贷款年利率(年利率%) eg. 4.9%
 * @param {float} resRate 公积金贷款年利率(年利率%) eg. 4.9%
 * @param {int} comLoanMonth 商业贷款期数
 * @param {int} resLoanMonth 公积金贷款期数
 * @param {string} loanType 还款方式['debj', 'debx']
 */
export const houseLoanCalc = (comLoanAmount, comRate, comLoanMonth, resLoanAmount, resRate, resLoanMonth, loanType) => {
  let comResult, resResult
  if (loanType === 'debj') {
    comResult = averageCapital(comLoanAmount, comRate, comLoanMonth)
    resResult = averageCapital(resLoanAmount, resRate, resLoanMonth)
  } else {
    comResult = averageInterest(comLoanAmount, comRate, comLoanMonth)
    resResult = averageInterest(resLoanAmount, resRate, resLoanMonth)
  }
  let monthRepay = []
  const minLen = Math.min(comResult.monthRepay.length, resResult.monthRepay.length)
  const maxLen = Math.max(comResult.monthRepay.length, resResult.monthRepay.length)
  for (let i = 0; i < minLen; i++) {
    monthRepay[i] = {
      repay: Math.round(100 * comResult.monthRepay[i].repay + resResult.monthRepay[i].repay) / 100,
      interest: Math.round(100 * comResult.monthRepay[i].interest + resResult.monthRepay[i].interest) / 100,
      capital: Math.round(100 * comResult.monthRepay[i].capital + resResult.monthRepay[i].capital) / 100,
      oddCapital: Math.round(100 * comResult.monthRepay[i].oddCapital + resResult.monthRepay[i].oddCapital) / 100
    }
  }
  monthRepay = monthRepay.concat(comResult.monthRepay.length > resResult.monthRepay.length ?
    comResult.monthRepay.slice(minLen, maxLen) : resResult.monthRepay.slice(minLen, maxLen))
  const result = {
    totalRepay: comResult.totalRepay + resResult.totalRepay,
    totalInterest: comResult.totalInterest + resResult.totalInterest,
    monthRepay
  }
  return result
}

/**
 * 等额本金
 * @param {float} oriAmount 贷款金额(万元)
 * @param {float} oriRate 贷款利率(年利率%) eg. 4.9%
 * @param {int} loanMonth 贷款期数
 */
export const averageCapital = (oriAmount, oriRate, loanMonth) => {
  const amount = 1E4 * oriAmount
  const rate = oriRate / 1200

  // 利息总额
  const totalInterest = Math.round(100 * (amount * rate * (loanMonth + 1) / 2)) / 100;
  // 累计还款总额
  const totalRepay = Math.round(100 * (totalInterest + amount)) / 100;
  // 每月偿还本金
  const averageCapital = Math.round(100 * (amount / loanMonth)) / 100

  const result = []
  for(let i = 1; i <= loanMonth; i++) {
    // 偿还利息
    const interest = Math.round(100 * (amount * rate * (loanMonth - i + 1) / loanMonth)) / 100
    // 偿还本息
    const repay = Math.round(100 * (averageCapital + interest)) / 100
    // 剩余本金
    const oddCapital = Math.round(100 * (amount * (loanMonth - i) / loanMonth)) / 100
    result.push({ repay, interest, capital: averageCapital, oddCapital })
  }
  return { totalRepay, totalInterest, monthRepay: result }
}

/**
 * 等额本息
 * @param {float} oriAmount 贷款金额(万元)
 * @param {float} oriRate 贷款利率(年利率%) eg. 4.9%
 * @param {int} loanMonth 贷款期数
 */
export const averageInterest = (oriAmount, oriRate, loanMonth) => {
  const amount = 1E4 * oriAmount
  const rate = oriRate / 1200

  // 利息总额
  const totalInterest = Math.round(100 * (amount * loanMonth * rate * Math.pow(1 + rate, loanMonth) / (Math.pow(1 + rate, loanMonth) - 1) - amount)) / 100;
  // 累计还款总额
  const totalRepay = Math.round(100 * (totalInterest + amount)) / 100;
  // 每月应还本息
  const averageRepay = Math.round(100 * (totalRepay / loanMonth)) / 100
  const result = []
  for(let i = 1; i <= loanMonth; i++) {
    // 偿还利息
    const interest = Math.round(100 * (amount * rate * (Math.pow(1 + rate, loanMonth) - Math.pow(1 + rate, i - 1)) / (Math.pow(1 + rate, loanMonth) - 1))) / 100
    // 偿还本金
    const capital = Math.round(100 * (averageRepay - interest)) / 100
    // 剩余本金
    const oddCapital = Math.round(100 * (amount * (Math.pow(1 + rate, loanMonth) - Math.pow(1 + rate, i)) / (Math.pow(1 + rate, loanMonth) - 1))) / 100
    result.push({ repay: averageRepay, interest, capital, oddCapital })
  }
  return { totalRepay, totalInterest, monthRepay: result }
}