import * as MAPPER from './auto-mapper.js'

/**
 * 全款买车计算
 * @param {float} carPrice 车价
 * @param {0,1} seatsSelect 座位数 SEAT_MAPPER
 * @param {0,1,2,3,4,5,6} szxed 第三者责任险赔付额度类型 SEAT_RELATED_MAPPER-dszzrx
 * @param {float} tax_ccs 车船使用税 CCSY_MAPPER-cost
 * @param {0,1} jkgc 玻璃单独破碎险-进口或国产 JKGC_MAPPER
 * @param {int} tbrs 车上人员责任险-投保人数
 * @param {0,1,2,3} csxbe 车身划痕-赔付额度 CSHHED_MAPPER
 */
export const fullPayCalc = (carPrice, seatsSelect, szxed, tax_ccs, jkgc, tbrs, csxbe) => {
  const tax_jqx = MAPPER.SEAT_RELATED_MAPPER[seatsSelect].jqx
  const tax = tax_calc(carPrice, tax_ccs, tax_jqx)
  const insr = insr_calc(carPrice, seatsSelect, szxed, jkgc, tbrs, csxbe)
  const sum = carPrice + tax_calc(carPrice, tax_ccs, tax_jqx).sum + insr_calc(carPrice, seatsSelect, szxed, jkgc, tbrs, csxbe).sum
  return { tax, insr, sum }
}

/**
 * 税费(总计)计算：包括车价、购置税、车船使用税、交强险
 * @param {float} carPrice 车价
 * @param {float} tax_ccs 车船使用税 CCSY_MAPPER
 * @param {float} tax_jqx 交强险 SEAT_RELATED_MAPPER
 * @returns {object:float} { gzsCost: 购置税, spCostFloat: 上牌费用, tax_ccs: 车船使用税, tax_jqx: 交强险, sum: 总数 }
 */
const tax_calc = (carPrice, tax_ccs, tax_jqx) => {
  const spCost = 500 // 上牌费用-默认500
  const gzsCost = Math.round(0.1 * (carPrice / 1.17))
  return { gzsCost, spCost, tax_ccs, tax_jqx, sum: gzsCost + spCost + tax_ccs + tax_jqx }
}

/**
 * 商业保险费用计算：包括第三者责任险、车辆损失险、全车强盗险、玻璃单独破碎险
 * @param {float} carPrice 车价
 * @param {0,1} seatsSelect 座位数 SEAT_MAPPER
 * @param {0,1,2,3,4,5,6} szxed 第三者责任险赔付额度类型 SEAT_RELATED_MAPPER-dszzrx
 * @param {float} jkgc 进口或国产 JKGC_MAPPER
 * @param {int} tbrs 投保人数
 * @param {0,1,2,3} csxbe 车身划痕-赔付额度 CSHHED_MAPPER
 * @returns {object:float} {}
 */
const insr_calc = (carPrice, seatsSelect, szxed, jkgc, tbrs, csxbe) => {
  var insr_szx = MAPPER.SEAT_RELATED_MAPPER[seatsSelect].dszzrx[szxed].cost    // 第三者责任险
  const insr_clssx = clssx_calc(carPrice, seatsSelect)    // 车辆损失险
  const insr_qcqdx = qcqdx_calc(carPrice, seatsSelect)    // 全车强盗险
  const insr_blddpsx = blddpsx_calc(carPrice, seatsSelect, jkgc)    // 玻璃单独破碎险
  const insr_zrssx = zrssx_calc(carPrice)     // 自燃损失险
  const insr_bjmptyx = bjmptyx_calc(insr_szx, insr_clssx)     // 不计免赔特约险
  const insr_wgzrx = wgzrx_calc(insr_szx)     // 无过责任险
  const insr_csryzrx = csryzrx_calc(tbrs)     // 车上人员责任险
  const insr_cshhx = cshhx_calc(carPrice, csxbe)     // 车身划痕险
  return { 
    insr_szx, insr_clssx, insr_qcqdx, insr_blddpsx, insr_zrssx, insr_bjmptyx, insr_wgzrx, insr_csryzrx, insr_cshhx,
    sum: insr_szx + insr_clssx + insr_qcqdx + insr_blddpsx + insr_zrssx + insr_bjmptyx + insr_wgzrx + insr_csryzrx + insr_cshhx
  }
}

/**
 * 车辆损失险
 * @param {float} carPrice 车价
 * @param {0,1} seatsSelect 座位数 SEAT_MAPPER
 */
const clssx_calc = (carPrice, seatsSelect) => {
  const clssxJcBfArr = [459, 550]
  const clssxFlArr = [0.01088, 0.01088]
  return Math.round(seatsSelect == 0 ? clssxJcBfArr[0] + carPrice * clssxFlArr[0] : clssxJcBfArr[1] + carPrice * clssxFlArr[0])
}

/**
 * 全车强盗险
 * @param {float} carPrice 车价
 * @param {0,1} seatsSelect 座位数 SEAT_MAPPER
 */
const qcqdx_calc = (carPrice, seatsSelect) => {
  const qcqdxJcBfArr = [102, 119]
  const qcqdxFlArr = [0.00451, 0.00374]
  return Math.round(0 == seatsSelect ? qcqdxJcBfArr[0] + carPrice * qcqdxFlArr[0] : qcqdxJcBfArr[1] + carPrice * qcqdxFlArr[1])
}

/**
 * 玻璃单独破碎险
 * @param {float} carPrice 车价
 * @param {0,1} seatsSelect 座位数 SEAT_MAPPER
 * @param {0,1} jkgc 进口或国产 JKGC_MAPPER
 */
const blddpsx_calc = (carPrice, seatsSelect, jkgc) => {
  const blddpsxFlArr0 = [0.00264, 0.00162]
  const blddpsxFlArr1 = [0.00272, 0.0017]
  return Math.round(0 == seatsSelect ? carPrice * blddpsxFlArr0[jkgc] : carPrice * blddpsxFlArr1[jkgc])
}

/**
 * 自燃损失险
 * @param {float} carPrice 车价
 */
const zrssx_calc = (carPrice) => {
  const zrssxFl = 0.0015
  return Math.round(carPrice * zrssxFl)
}

/**
 * 不计免赔特约险
 * @param {float} insr_szx 第三者责任险
 * @param {float} insr_clssx 车辆损失险
 */
const bjmptyx_calc = (insr_szx, insr_clssx) => {
  return Math.round(0.2 * (insr_szx + insr_clssx))
}

/**
 * 无过责任险
 * @param {float} insr_szx 第三者责任险
 */
const wgzrx_calc = (insr_szx) => {
  return Math.round(0.2 * insr_szx)
}

/**
 * 车上人员责任险
 * @param {*} tbrs 
 */
const csryzrx_calc = (tbrs) => {
  return 50 * tbrs
}

/**
 * 车身划痕险
 * @param {*} carPrice 车价
 * @param {*} csxbe 赔付额度
 */
const cshhx_calc = (carPrice, csxbe) => {
  const cshhxBfArr0 = [400, 570, 760, 1140]
  const cshhxBfArr1 = [585, 900, 1170, 1780]
  const cshhxBfArr2 = [850, 1100, 1500, 2250]
  return 3E5 >= carPrice ? cshhxBfArr0[csxbe] : 3E5 < carPrice && 5E5 >= carPrice ? cshhxBfArr1[csxbe] : 5E5 < carPrice && cshhxBfArr2[csxbe]
}