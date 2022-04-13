// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.

import {TimeFrame} from "./insights";

// See LICENSE.txt for license information.
export type Reaction = {
    user_id: string;
    post_id: string;
    emoji_name: string;
    create_at: number;
};

export type TopReaction = {
    emoji_name: string;
    count: number;
}

export type TopReactionResponse = {
    has_next: boolean;
    items: TopReaction[];
    timeFrame?: TimeFrame;
}