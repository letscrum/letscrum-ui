"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Demo() {
    const callAPI = async () => {
		try {
			const res = await fetch(
				`http://localhost:8081/api/v1/token`
			);
			const data = await res.json();
			console.log(data);
		} catch (err) {
			console.log(err);
		}
	};

    return (
		// <div>
		// 	<main>
		// 		<button onClick={callAPI}>Make API Call</button>
		// 	</main>
		// </div>
		<DefaultLayout>
		<a href="#" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

		<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Gateway1</h5>
		<p className="font-normal text-gray-700 dark:text-gray-400">Cluster: k81</p>
		</a>
		</DefaultLayout>
	);
}
