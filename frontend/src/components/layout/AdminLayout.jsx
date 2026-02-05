const AdminLayout = ({ children }) => {
	return (
		<div
			style={{
				marginLeft: '240px',
				marginTop: '64px',
				padding: '24px',
				minHeight: 'calc(100vh - 64px)',
			}}
		>
			{children}
		</div>
	);
};

export default AdminLayout;
