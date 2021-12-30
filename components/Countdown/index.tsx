import React, { useState, useEffect } from 'react'

import { prevZero } from '../../utils/string'
import { GetRemainDays } from '../../utils/date'

import styles from './Countdown.module.css'

const END_TIME = 1648684800000    // 2022.3.31 0:0:0 UTC

const CountNumber = ({ value, cnt, mark }) => (
  <div className={styles.countNumber}>
    {prevZero(value, '0', cnt).split('').map((num, index) => (
      <div className={styles.item} key={`${mark}-${index}`}>
        {num}
      </div>
    ))}
  </div>
)

const Countdown = () => {
  const [day, setDay] = useState(0)
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)

  useEffect(() => {
    let interval = null;

    interval = setInterval(() => {
      const { day: d, hour: h, minute: m } = GetRemainDays(new Date().getTime(), END_TIME)
      setDay(d)
      setHour(h)
      setMinute(m)
    }, 1000)

    return () => clearInterval(interval)
  }, [day, hour, minute])

  return (
    <div className={styles.countdownContainer}>
      <div className={styles.countdownLeft}>
        <div className={styles.title}>Remaining time to claim</div>
        <div className={styles.title}>your tokens</div>
        <div className={styles.details}>
          Remember claim your tokens before March 31
        </div>
      </div>
      <div className={styles.countdownRight}>
        <div className={styles.countdownContent}>
          <div className={styles.countdownDays}>
            <CountNumber value={day} cnt={3} mark='hour' />
          </div>
          <div className={styles.countdownLabels}>Days</div>
        </div>
        <div className={styles.countdownContent}>
          <div className={styles.countdownDays}>
            <CountNumber value={hour} cnt={2} mark='day' />
          </div>
          <div className={styles.countdownLabels}>Hours</div>
        </div>
        <div className={styles.countdownContent}>
          <div className={styles.countdownDays}>
            <CountNumber value={minute} cnt={2} mark='min' />
          </div>
          <div className={styles.countdownLabels}>Minutes</div>
        </div>
      </div>
    </div>
  )
}

export default Countdown
