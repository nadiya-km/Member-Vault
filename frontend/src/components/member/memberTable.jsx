import { useNavigate } from 'react-router-dom';

const MemberTable = ({ members }) => {
	const navigate = useNavigate();

	return (
		<div className="table-responsive">
			<table className="table table-hover align-middle mb-0">
				<thead className="bg-light">
					<tr>
						<th className="ps-4">Member</th>
						<th>Contact Details</th>
						<th>Status</th>
						<th className="text-end pe-4">Actions</th>
					</tr>
				</thead>
				<tbody>
					{members.map((m) => (
						<tr key={m._id}>
							<td className="ps-4">
								<div className="d-flex align-items-center">
									<div className="rounded-circle bg-midnight text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
										{m.name.charAt(0).toUpperCase()}
									</div>
									<div>
										<div className="fw-bold text-dark">{m.name}</div>
										<div className="text-muted small">ID: {m._id.slice(-6).toUpperCase()}</div>
									</div>
								</div>
							</td>
							<td>
								<div className="d-flex flex-column">
									<span className="small"><i className="bi bi-envelope me-2 text-muted"></i>{m.email}</span>
									<span className="small"><i className="bi bi-phone me-2 text-muted"></i>{m.phone}</span>
								</div>
							</td>
							<td>
								<span className={`badge px-3 rounded-pill ${m.status === 'active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
									}`}>
									{m.status.toUpperCase()}
								</span>
							</td>
							<td className="text-end pe-4">
								<button
									className="btn btn-sm btn-oxford-primary px-3"
									onClick={() => navigate(`/admin/members/${m._id}`)}
								>
									<i className="bi bi-gear-fill me-1"></i> Manage
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default MemberTable;
