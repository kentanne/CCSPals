import { SessionItem } from '@/interfaces/session';
import { FontAwesomeIcon, faEllipsisH } from '@/components/atoms/SessionIcons';

interface PopupMenuProps {
  item: SessionItem;
  index: number;
  type: string;
  options: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: (item: SessionItem, event: React.MouseEvent) => void;
  }>;
  isOpen: boolean;
  onToggle: (event: React.MouseEvent) => void;
  styles: any; // Pass the CSS module object
}

export default function PopupMenu({ item, index, type, options, isOpen, onToggle, styles }: PopupMenuProps) {
  return (
    <>
      <div className={styles.sessionEllipsis} onClick={onToggle}>
        <FontAwesomeIcon icon={faEllipsisH} style={{ cursor: 'pointer', color: '#066678', fontSize: '1.2rem' }} />
      </div>
      {isOpen && (
        <div className={styles.sessionPopupMenu} onClick={(e) => e.stopPropagation()}>
          {options.map((option, idx) => (
            <div
              key={`${type}-${index}-${idx}`}
              className={styles.sessionPopupOption}
              onClick={(e) => option.onClick(item, e)}
            >
              <span className={styles.sessionOptionIcon}>
                {option.icon}
              </span>
              <span className={styles.sessionOptionText}>
                {option.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}