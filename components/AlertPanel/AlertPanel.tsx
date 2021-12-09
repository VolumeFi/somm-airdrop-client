import React from 'react'

import styles from './AlertPanel.module.css'
import cn from "classnames";

interface IAlertPanel {
  type: string
  text: string
}

export default function AlertPanel({
  type = "success",
  text,
}: IAlertPanel) {
  return (
    <div className={cn(styles.alertPanel, {
      [styles["success"]]: type === "success",
      [styles["error"]]: type === "error"
    })}>
      {type === "success" && <img className={styles.alertPanelIcon} src="/assets/alert/success.svg" /> }
      {type === "error" && <img className={styles.alertPanelIcon} src="/assets/alert/error.png" />}
      <p className={styles.alertPanelText}>{text}</p>
    </div>
  )
}
