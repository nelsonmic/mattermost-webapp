// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, useCallback, useEffect, useState} from 'react';
import {FormattedMessage} from 'react-intl';
import {useDispatch, useSelector} from 'react-redux';

import {setInsightsInitialisationState} from 'mattermost-redux/actions/preferences';

import {getBool} from 'mattermost-redux/selectors/entities/preferences';

import {GlobalState as EntitiesGlobalState} from 'mattermost-redux/types/store';

import {Preferences} from 'mattermost-redux/constants';

import {showInsightsPulsatingDot} from 'selectors/insights';

import {GlobalState} from 'types/store';

import insightsPreview from 'images/Insights-Preview-Image.jpg';

import TourTip, {useMeasurePunchouts} from 'components/widgets/tour_tip';
import FormattedMarkdownMessage from 'components/formatted_markdown_message.jsx';
import {OnboardingTaskCategory, OnboardingTaskList} from 'components/onboarding_tasks';

const title = (
    <FormattedMessage
        id='activityAndInsights.tutorialTip.title'
        defaultMessage='Introducing: Insights'
    />
);

const screen = (
    <>
        <FormattedMarkdownMessage
            id='activityAndInsights.tutorialTip.description'
            defaultMessage='Check out the new Insights feature added to your workspace. See what content is most active, and learn how you and your teammates are using your workspace.'
        />
        <img
            src={insightsPreview}
            className='insights-img'
        />
    </>

);

const prevBtn = (
    <FormattedMessage
        id='activityAndInsights.tutorial_tip.notNow'
        defaultMessage='Not now'
    />
);

const nextBtn = (
    <FormattedMessage
        id='activityAndInsights.tutorial_tip.viewInsights'
        defaultMessage='View insights'
    />
);

const InsightsTourTip = () => {
    const dispatch = useDispatch();
    const showTip = useSelector(showInsightsPulsatingDot);
    const showNextStepsEphemeral = useSelector((state: GlobalState) => state.views.nextSteps.show);
    const showTaskList = useSelector((state: EntitiesGlobalState) => getBool(state, OnboardingTaskCategory, OnboardingTaskList.ONBOARDING_TASK_LIST_SHOW));

    const [tipOpened, setTipOpened] = useState(showTip);

    const handleDismiss = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setInsightsInitialisationState({[Preferences.INSIGHTS_VIEWED]: true}));
        setTipOpened(false);
    }, []);

    const handleNext = useCallback(() => {
        dispatch(setInsightsInitialisationState({[Preferences.INSIGHTS_VIEWED]: true}));
        setTipOpened(false);
    }, []);

    const handleOpen = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setTipOpened(true);
    }, []);

    const isOnboardingOngoing = useCallback(() => {
        if (showTaskList || showNextStepsEphemeral) {
            return true;
        }
        return false;
    }, [showTaskList, showNextStepsEphemeral]);

    const overlayPunchOut = useMeasurePunchouts(['sidebar-insights-button'], []);

    useEffect(() => {
        // If the user has ongoing onboarding steps we want to just remove the insights intro modal in order to not overburden with tips
        if (showTip && isOnboardingOngoing()) {
            dispatch(setInsightsInitialisationState({[Preferences.INSIGHTS_VIEWED]: true}));
        }
    }, [showTip, isOnboardingOngoing]);

    return (
        <>
            {
                (showTip && !isOnboardingOngoing()) &&
                <TourTip
                    show={tipOpened}
                    screen={screen}
                    title={title}
                    overlayPunchOut={overlayPunchOut}
                    placement='right-start'
                    pulsatingDotPlacement='right'
                    step={1}
                    singleTip={true}
                    showOptOut={false}
                    interactivePunchOut={true}
                    handleDismiss={handleDismiss}
                    handleNext={handleNext}
                    handleOpen={handleOpen}
                    handlePrevious={handleDismiss}
                    nextBtn={nextBtn}
                    prevBtn={prevBtn}
                    offset={[-30, 5]}
                    className={'insights-tip'}
                />
            }
        </>
    );
};

export default memo(InsightsTourTip);
