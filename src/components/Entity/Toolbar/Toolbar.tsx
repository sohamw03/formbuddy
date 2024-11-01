import styles from "./Toolbar.module.css";
export default function Toolbar() {
  return (
    <div className={styles.toolbar}>
      <div>
        <div>Sizes</div>
        <div>1920 x 1080</div>
        <div>Crop</div>
      </div>
    </div>
  );
}
