import { useRouter } from "next/router";
import { OppEditForm } from "../../components/opp";
import { trpc } from "../../utils/trpc";

const EditOpp = () => {
  const router = useRouter();
  const { oppId } = router.query;
  if (typeof oppId !== "string") {
    return <div>Invalid oppId type: {typeof oppId}</div>;
  }

  const { data: opp, isLoading, error } = trpc.opp.get.useQuery({ id: oppId });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!opp || error) {
    return <div>{error?.message || `Opp not found. id:${oppId}}`}</div>;
  }

  return (
    <div className="px-36">
      <h1 className="py-4 text-3xl">Editing: {oppId}</h1>
      <OppEditForm oppId={oppId} />
    </div>
  );
};

export default EditOpp;
