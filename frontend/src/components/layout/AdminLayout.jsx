const AdminLayout = ({ children }) => {
  return (
    <div
      style={{
        marginLeft: window.innerWidth > 768 ? '240px' : '0',
        paddingBottom: window.innerWidth <= 768 ? '70px' : '0',
        padding: '24px',
      }}
    >
      {children}
    </div>
  );
};

export default AdminLayout;
