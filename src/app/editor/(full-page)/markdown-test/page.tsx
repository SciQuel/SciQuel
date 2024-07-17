import MarkdownEditorStoryInfo from "@/components/EditorDashboard/MarkdownEditorStoryInfo";

export default function test({}:{}){
    return(
        <div className="h-[200px]"> {/* Adjust the height as needed */}
            <MarkdownEditorStoryInfo 
                initialValue="initialBody" 
                id={"64bed0cd8f2ca25b95e6c340"}
                style={{ height: '100%' }} // Ensure it takes full height of the parent div
            />
        </div>
    )
}