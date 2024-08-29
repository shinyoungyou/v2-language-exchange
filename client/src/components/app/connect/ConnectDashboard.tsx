import { observer } from "mobx-react-lite";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Grid } from "semantic-ui-react";
import { PagingParams } from "@/models/pagination";
import { useStore } from "@/stores/store";
import MemberFilters from "./MemberFilters";
import MemberList from "./MemberList";
import LoadingComponent from "@/components/layout/LoadingComponent";

export default observer(function ConnectDashboard() {
    const { memberStore } = useStore();
    const { loadMembers, loadingInitial, setPagingParams, pagination } =
        memberStore;
    const [loadingNext, setLoadingNext] = useState(false);

    // useEffect(() => {
    // // userStore에서 store.memberStore.setUserParams(new UserParams(this.user!)); 담고, useEffect loadMembers까지 하면 2번이나 불러와져서 주석처리함
    //   loadMembers();
    // }, [loadMembers])

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadMembers().then(() => setLoadingNext(false));
    }

    if (loadingInitial)
        return <LoadingComponent inverted content="Loading profile..." />;

    return (
        <Grid container stackable>
            <Grid.Row>
                <Grid.Column width={16}>
                    <MemberFilters />
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={
                            !loadingNext &&
                            !!pagination &&
                            pagination.currentPage < pagination.totalPages
                        }
                        initialLoad={false}
                    >
                        <MemberList />
                    </InfiniteScroll>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
});
