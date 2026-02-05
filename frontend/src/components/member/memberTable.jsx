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
								className="btn btn-primary btn-sm"
								onClick={() => navigate(`/admin/members/${m._id}`)}
							>
								Manage
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default MemberTable;
