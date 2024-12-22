import styles from './Footer.module.scss'

export function Footer() {
	return (
		<div className={styles.wrapper}>
			<div className={styles.footer}>
				WanderWonder.com &copy; 2024 Все права не защищены, используйте на свой страх и риск.
			</div>
		</div>
	)
}
