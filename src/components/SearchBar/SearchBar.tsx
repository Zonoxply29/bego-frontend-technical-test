import searchIcon from "../../assets/icons/search.svg";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={styles.searchBar}>
      <img
        className={styles.icon}
        src={searchIcon}
        alt=""
        aria-hidden="true"
      />

      <input
        className={styles.input}
        type="search"
        value={value}
        aria-label="Search orders"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}