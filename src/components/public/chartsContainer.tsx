interface ChartsContainerProps {
	children: React.ReactNode;
}

export default function ChartsContainer(props: ChartsContainerProps) {
	const { children } = props;
	return <div className="bg-white rounded-md border">{children}</div>;
}
