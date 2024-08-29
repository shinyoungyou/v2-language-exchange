import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Grid, Tab } from "semantic-ui-react";
import { useStore } from "@/stores/store";
import MessageList from "./MessageList";
import LoadingComponent from "@/components/layout/LoadingComponent";

export default observer(function MessageDashboard() {
    const { messageStore } = useStore();
    const { loadMessages, activeTab, setActiveTab, loadingInitial } =
        messageStore;

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    if (loadingInitial)
        return <LoadingComponent inverted content="Loading profile..." />;

    const panes = [
        {
            menuItem: "Unread messages",
            render: () => (
                <Tab.Pane>
                    <MessageList />
                </Tab.Pane>
            ),
        },
        {
            menuItem: "Inbox messages",
            render: () => (
                <Tab.Pane>
                    <MessageList />
                </Tab.Pane>
            ),
        },
        {
            menuItem: "Outbox messages",
            render: () => (
                <Tab.Pane>
                    <MessageList />
                </Tab.Pane>
            ),
        },
    ];

    return (
        <Grid container stackable className="messageDashboard">
            <Grid.Row>
                <Grid.Column width={16}>
                    <Tab
                        menu={{ secondary: true, pointing: true }}
                        panes={panes}
                        onTabChange={(_, data) =>
                            setActiveTab(data.activeIndex)
                        }
                        activeIndex={activeTab}
                    />
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
});
