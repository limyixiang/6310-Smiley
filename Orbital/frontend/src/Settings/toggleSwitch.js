import React from "react";
import styles from "./toggleSwitch.module.css";

function ToggleSwitch({ toggled, name, handleInputChange, disabled }) {
    return (
        <label className={styles.switch}>
            <input
                type="checkbox"
                checked={toggled}
                onChange={handleInputChange(name)}
                disabled={disabled}
            />
            <span className={styles.slider + " " + styles.round}></span>
        </label>
    );
}

export default ToggleSwitch;
