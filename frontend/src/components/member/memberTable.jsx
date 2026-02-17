import { useNavigate } from 'react-router-dom';

const MemberTable = ({ members }) => {
	const navigate = useNavigate();

	return (
		<table className="table">
			<thead>
				<tr>
					<th>Name</th>
					<th>Email</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{members.map((m) => (
					<tr key={m._id}>
						<td>{m.name}</td>
						<td>{m.email}</td>
						<td>
							<button
								className="btn-oxford-primary btn-sm"
								onClick={() => navigate(`/admin/members/${m._id}`)}
								style={{ height: '36px', padding: '0 15px', fontSize: '0.85rem' }}
							>
								<i className="bi bi-gear-fill me-1"></i> Manage
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default MemberTable;
