// 座位数
export const SEAT_MAPPER = [
  { label: '6座以下', value: 0 },
  { label: '6座及以上', value: 1 }
]

export const JKGC_MAPPER = [
  { label: '进口', value: 0 },
  { label: '国产', value: 1 }
]

// 车船使用费
export const CCSY_MAPPER = [
  { label: '1.0L(含)以下', cost: 300 },
  { label: '1.0-1.6L(含)', cost: 420 },
  { label: '1.6-2.0L(含)', cost: 480 },
  { label: '2.0-2.5L(含)', cost: 900 },
  { label: '2.5-3.0L(含)', cost: 1920 },
  { label: '3.0-4.0L(含)', cost: 3480 },
  { label: '4.0L以上', cost: 5280 }
]

/**
 * 交强险-第三者责任险
 * @field label 显示文案
 * @field value 不同座位类别对应的值
 * @field jqx 交强险费用
 * @field dszzrx 第三者责任险费用
 */
export const SEAT_RELATED_MAPPER = [
  {
    label: '6座以下',
    value: 0,
    jqx: 950,
    dszzrx: [
      { label: '5万', value: 0, cost: 516 },
      { label: '10万', value: 1, cost: 746 },
      { label: '15万', value: 2, cost: 850 },
      { label: '20万', value: 3, cost: 924 },
      { label: '30万', value: 4, cost: 1043 },
      { label: '50万', value: 5, cost: 1252 },
      { label: '100万', value: 6, cost: 1630 }
    ]
  },
  {
    label: '6座及以上',
    value: 1,
    jqx: 1100,
    dszzrx: [
      { label: '5万', cost: 478 },
      { label: '10万', cost: 674 },
      { label: '15万', cost: 761 },
      { label: '20万', cost: 821 },
      { label: '30万', cost: 919 },
      { label: '50万', cost: 1094 },
      { label: '100万', cost: 1425 }
    ]
  }
]

/**
 * 车身划痕险赔付额度
 */
export const CSHHED_MAPPER = [
  { label: '2千', value: 0 },
  { label: '5千', value: 1 },
  { label: '1万', value: 2 },
  { label: '2万', value: 3 },
]