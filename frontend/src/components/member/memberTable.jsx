const MemberTable = ({ members = [] }) => {
	return (
		<div className="bg-white rounded-xl shadow overflow-x-auto">
			<table className="w-full text-sm">
				<thead className="bg-gray-100 text-gray-700">
					<tr>
						<th className="px-4 py-3 text-left">Name</th>
						<th className="px-4 py-3 text-left">Email</th>
						<th className="px-4 py-3 text-left">Phone</th>
						<th className="px-4 py-3 text-left">WhatsApp</th>
						<th className="px-4 py-3 text-left">Age</th>
						<th className="px-4 py-3 text-left">Status</th>
					</tr>
				</thead>

				<tbody>
					{members.length === 0 && (
						<tr>
							<td colSpan="6" className="text-center py-6 text-gray-500">
								No members found
							</td>
						</tr>
					)}

					{members.map((m) => (
						<tr key={m._id} className="border-t hover:bg-gray-50 transition">
							<td className="px-4 py-3 font-medium">{m.name}</td>
							<td className="px-4 py-3">{m.email}</td>
							<td className="px-4 py-3">{m.phone}</td>
							<td className="px-4 py-3">{m.whatsappNumber}</td>
							<td className="px-4 py-3">{m.age || '-'}</td>
							<td className="px-4 py-3">
								<span
									className={`px-2 py-1 rounded-full text-xs font-medium ${
										m.status === 'active'
											? 'bg-green-100 text-green-700'
											: 'bg-red-100 text-red-700'
									}`}
								>
									{m.status}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default MemberTable;
