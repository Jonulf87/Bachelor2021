import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import TicketTypeAdminForm from './TicketTypeAdminForm';
import TicketTypeList from './TicketTypeList';


export default function TicketMain() {

    let [triggerUpdate, setTriggerUpdate] = useState(false);

    const updateList = () => {
        setTriggerUpdate(oldValue => !oldValue);
    }

    return (
        <>
            <Grid
                container
            >
                {/*Grid container som inneholder admin for billettyper*/}
                <Grid
                    container
                    item
                    xs={12}
                >
                    <Grid
                        container
                        item
                        xs={4}
                    >
                        <TicketTypeAdminForm updateList={ updateList }/>
                    </Grid>
                    <Grid
                        item
                        xs={8}
                    >
                        <TicketTypeList triggerUpdate={ triggerUpdate } />
                    </Grid>
                </Grid>

                {/*Grid container som inneholder admin for kampanjer*/}
                <Grid
                    container
                    item
                    xs={6}
                >
                </Grid>

                {/*Grid container som inneholder en liste over alle solgte billetter. expandable*/}
                <Grid>
                </Grid>
            </Grid>
        </>
    );
}