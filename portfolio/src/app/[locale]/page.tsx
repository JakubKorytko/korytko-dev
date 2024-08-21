import {useTranslations} from 'next-intl';
import { ReadLayout, ReadSkills } from "@/utils/ReadData";
import TestComponent from "@/app/[locale]/TestComponent";
import {TestComponentMessages} from "@/app/[locale]/TestComponent.type";

export default function Index() {
    const t = useTranslations('Index');

    const messages: TestComponentMessages = {
        title: t('title'),
        content: t('content')
    }

    return (
        <>
            <TestComponent messages={messages} />
            <br />
            <p>Layout</p>
            <code>{JSON.stringify(ReadLayout())}</code>
            <p>Skills</p>
            <code>{JSON.stringify(ReadSkills())}</code>
        </>
    )
}