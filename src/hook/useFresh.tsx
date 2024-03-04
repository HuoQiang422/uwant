/**
 * @description 刷新表格
 */
import { useCallback, useState } from "react";

export default function useFresh() {
	const [key, setKey] = useState<number>(0);

	const refresh = useCallback(() => {
		setKey((prevKey) => prevKey + 1);
	}, []);

	return {
		key,
		refresh,
	};
}
