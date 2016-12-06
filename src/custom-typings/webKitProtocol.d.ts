// Root namespace holding all Webkit protocol related interfaces.
declare namespace Webkit {
    
    namespace ApplicationCache {
        
        // ApplicationCache
        interface ApplicationCache {
            getFramesWithManifests?(): Promise<Webkit.Response<GetFramesWithManifestsResult>>; // // Returns array of frame identifiers with manifest urls for each frame containing a document associated with some application cache.
            enable?(): Promise<Webkit.Response<any>>; // // Enables application cache domain notifications.
            getManifestForFrame?(args: GetManifestForFrameParams ): Promise<Webkit.Response<GetManifestForFrameResult>>; // // Returns manifest URL for document in the given frame.
            getApplicationCacheForFrame?(args: GetApplicationCacheForFrameParams ): Promise<Webkit.Response<GetApplicationCacheForFrameResult>>; // // Returns relevant application cache data for the document in given frame.
            // Event: applicationCacheStatusUpdated(ApplicationCacheStatusUpdatedEventArgs)
            // Event: networkStateUpdated(NetworkStateUpdatedEventArgs)
        }
        
        // Detailed application cache resource information.
        interface ApplicationCacheResource {
            url: string; // Resource url.
            size: number; // Resource size.
            type: string; // Resource type.
        }
        
        // Detailed application cache information.
        interface ApplicationCache {
            manifestURL: string; // Manifest URL.
            size: number; // Application cache size.
            creationTime: number; // Application cache creation time.
            updateTime: number; // Application cache update time.
            resources: ApplicationCacheResource[]; // Application cache resources.
        }
        
        // Frame identifier - manifest URL pair.
        interface FrameWithManifest {
            frameId: Network.FrameId; // Frame identifier.
            manifestURL: string; // Manifest URL.
            status: number; // Application cache status.
        }
        
        // The result from getFramesWithManifests method
        interface GetFramesWithManifestsResult {
            frameIds: FrameWithManifest[]; // Array of frame identifiers with manifest urls for each frame containing a document associated with some application cache.
        }
        
        // The result from getManifestForFrame method
        interface GetManifestForFrameResult {
            manifestURL: string; // Manifest URL for document in the given frame.
        }
        
        // Parameters passed to the 'getManifestForFrame' method
        interface GetManifestForFrameParams {
            frameId: Network.FrameId; // Identifier of the frame containing document whose manifest is retrieved.
        }
        
        // The result from getApplicationCacheForFrame method
        interface GetApplicationCacheForFrameResult {
            applicationCache: ApplicationCache; // Relevant application cache data for the document in given frame.
        }
        
        // Parameters passed to the 'getApplicationCacheForFrame' method
        interface GetApplicationCacheForFrameParams {
            frameId: Network.FrameId; // Identifier of the frame containing document whose application cache is retrieved.
        }
        
        // Parameters passed to the 'applicationCacheStatusUpdated' method
        interface ApplicationCacheStatusUpdatedEventArgs {
            frameId: Network.FrameId; // Identifier of the frame containing document whose application cache updated status.
            manifestURL: string; // Manifest URL.
            status: number; // Updated application cache status.
        }
        
        // Parameters passed to the 'networkStateUpdated' method
        interface NetworkStateUpdatedEventArgs {
            isNowOnline: boolean; // 
        }
    }
    
    // This domain exposes CSS read/write operations. All CSS objects, like stylesheets, rules, and styles, have an associated <code>id</code> used in subsequent operations on the related object. Each object type has a specific <code>id</code> structure, and those are not interchangeable between objects of different kinds. CSS objects can be loaded using the <code>get*ForNode()</code> calls (which accept a DOM node id). Alternatively, a client can discover all the existing stylesheets with the <code>getAllStyleSheets()</code> method and subsequently load the required stylesheet contents using the <code>getStyleSheet[Text]()</code> methods.
    namespace CSS {
        
        // CSS
        interface CSS {
            enable?(): Promise<Webkit.Response<any>>; // // Enables the CSS agent for the given page. Clients should not assume that the CSS agent has been enabled until the result of this command is received.
            disable?(): Promise<Webkit.Response<any>>; // // Disables the CSS agent for the given page.
            getMatchedStylesForNode?(args: GetMatchedStylesForNodeParams ): Promise<Webkit.Response<GetMatchedStylesForNodeResult>>; // // Returns requested styles for a DOM node identified by <code>nodeId</code>.
            getInlineStylesForNode?(args: GetInlineStylesForNodeParams ): Promise<Webkit.Response<GetInlineStylesForNodeResult>>; // // Returns the styles defined inline (explicitly in the "style" attribute and implicitly, using DOM attributes) for a DOM node identified by <code>nodeId</code>.
            getComputedStyleForNode?(args: GetComputedStyleForNodeParams ): Promise<Webkit.Response<GetComputedStyleForNodeResult>>; // // Returns the computed style for a DOM node identified by <code>nodeId</code>.
            getAllStyleSheets?(): Promise<Webkit.Response<GetAllStyleSheetsResult>>; // // Returns metainfo entries for all known stylesheets.
            getStyleSheet?(args: GetStyleSheetParams ): Promise<Webkit.Response<GetStyleSheetResult>>; // // Returns stylesheet data for the specified <code>styleSheetId</code>.
            getStyleSheetText?(args: GetStyleSheetTextParams ): Promise<Webkit.Response<GetStyleSheetTextResult>>; // // Returns the current textual content and the URL for a stylesheet.
            setStyleSheetText?(args: SetStyleSheetTextParams ): Promise<Webkit.Response<any>>; // // Sets the new stylesheet text, thereby invalidating all existing <code>CSSStyleId</code>'s and <code>CSSRuleId</code>'s contained by this stylesheet.
            setStyleText?(args: SetStyleTextParams ): Promise<Webkit.Response<SetStyleTextResult>>; // // Sets the new <code>text</code> for the respective style.
            setRuleSelector?(args: SetRuleSelectorParams ): Promise<Webkit.Response<SetRuleSelectorResult>>; // // Modifies the rule selector.
            createStyleSheet?(args: CreateStyleSheetParams ): Promise<Webkit.Response<CreateStyleSheetResult>>; // // Creates a new special "inspector" stylesheet in the frame with given <code>frameId</code>.
            addRule?(args: AddRuleParams ): Promise<Webkit.Response<AddRuleResult>>; // // Creates a new empty rule with the given <code>selector</code> in a stylesheet with given <code>styleSheetId</code>.
            getSupportedCSSProperties?(): Promise<Webkit.Response<GetSupportedCSSPropertiesResult>>; // // Returns all supported CSS property names.
            getSupportedSystemFontFamilyNames?(): Promise<Webkit.Response<GetSupportedSystemFontFamilyNamesResult>>; // // Returns all supported system font family names.
            forcePseudoState?(args: ForcePseudoStateParams ): Promise<Webkit.Response<any>>; // // Ensures that the given node will have specified pseudo-classes whenever its style is computed by the browser.
            getNamedFlowCollection?(args: GetNamedFlowCollectionParams ): Promise<Webkit.Response<GetNamedFlowCollectionResult>>; // // Returns the Named Flows from the document.
            // Event: mediaQueryResultChanged()
            // Event: styleSheetChanged(StyleSheetChangedEventArgs)
            // Event: styleSheetAdded(StyleSheetAddedEventArgs)
            // Event: styleSheetRemoved(StyleSheetRemovedEventArgs)
            // Event: namedFlowCreated(NamedFlowCreatedEventArgs)
            // Event: namedFlowRemoved(NamedFlowRemovedEventArgs)
            // Event: regionOversetChanged(RegionOversetChangedEventArgs)
            // Event: registeredNamedFlowContentElement(RegisteredNamedFlowContentElementEventArgs)
            // Event: unregisteredNamedFlowContentElement(UnregisteredNamedFlowContentElementEventArgs)
        }
        
        type StyleSheetId = string; // 
        
        // This object identifies a CSS style in a unique way.
        interface CSSStyleId {
            styleSheetId: StyleSheetId; // Enclosing stylesheet identifier.
            ordinal: number; // The style ordinal within the stylesheet.
        }
        
        type StyleSheetOrigin = string; // Stylesheet type: "user" for user stylesheets, "user-agent" for user-agent stylesheets, "inspector" for stylesheets created by the inspector (i.e. those holding the "via inspector" rules), "regular" for regular stylesheets.
        
        // This object identifies a CSS rule in a unique way.
        interface CSSRuleId {
            styleSheetId: StyleSheetId; // Enclosing stylesheet identifier.
            ordinal: number; // The rule ordinal within the stylesheet.
        }
        
        // CSS rule collection for a single pseudo style.
        interface PseudoIdMatches {
            pseudoId: number; // Pseudo style identifier (see <code>enum PseudoId</code> in <code>RenderStyleConstants.h</code>).
            matches: RuleMatch[]; // Matches of CSS rules applicable to the pseudo style.
        }
        
        // CSS rule collection for a single pseudo style.
        interface InheritedStyleEntry {
            inlineStyle?: CSSStyle; // The ancestor node's inline style, if any, in the style inheritance chain.
            matchedCSSRules: RuleMatch[]; // Matches of CSS rules matching the ancestor node in the style inheritance chain.
        }
        
        // Match data for a CSS rule.
        interface RuleMatch {
            rule: CSSRule; // CSS rule in the match.
            matchingSelectors: number[]; // Matching selector indices in the rule's selectorList selectors (0-based).
        }
        
        // CSS selector.
        interface CSSSelector {
            text: string; // Canonicalized selector text.
            specificity?: number[]; // Specificity (a, b, c) tuple. Included if the selector is sent in response to CSS.getMatchedStylesForNode which provides a context element.
            dynamic?: boolean; // Whether or not the specificity can be dynamic. Included if the selector is sent in response to CSS.getMatchedStylesForNode which provides a context element.
        }
        
        // Selector list data.
        interface SelectorList {
            selectors: CSSSelector[]; // Selectors in the list.
            text: string; // Rule selector text.
            range?: SourceRange; // Rule selector range in the underlying resource (if available).
        }
        
        // CSS style information for a DOM style attribute.
        interface CSSStyleAttribute {
            name: string; // DOM attribute name (e.g. "width").
            style: CSSStyle; // CSS style generated by the respective DOM attribute.
        }
        
        // CSS stylesheet metainformation.
        interface CSSStyleSheetHeader {
            styleSheetId: StyleSheetId; // The stylesheet identifier.
            frameId: Network.FrameId; // Owner frame identifier.
            sourceURL: string; // Stylesheet resource URL.
            origin: StyleSheetOrigin; // Stylesheet origin.
            title: string; // Stylesheet title.
            disabled: boolean; // Denotes whether the stylesheet is disabled.
            isInline: boolean; // Whether this stylesheet is a <style> tag created by the parser. This is not set for document.written <style> tags.
            startLine: number; // Line offset of the stylesheet within the resource (zero based).
            startColumn: number; // Column offset of the stylesheet within the resource (zero based).
        }
        
        // CSS stylesheet contents.
        interface CSSStyleSheetBody {
            styleSheetId: StyleSheetId; // The stylesheet identifier.
            rules: CSSRule[]; // Stylesheet resource URL.
            text?: string; // Stylesheet resource contents (if available).
        }
        
        // CSS rule representation.
        interface CSSRule {
            ruleId?: CSSRuleId; // The CSS rule identifier (absent for user agent stylesheet and user-specified stylesheet rules).
            selectorList: SelectorList; // Rule selector data.
            sourceURL?: string; // Parent stylesheet resource URL (for regular rules).
            sourceLine: number; // Line ordinal of the rule selector start character in the resource.
            origin: StyleSheetOrigin; // Parent stylesheet's origin.
            style: CSSStyle; // Associated style declaration.
            media?: CSSMedia[]; // Media list array (for rules involving media queries). The array enumerates media queries starting with the innermost one, going outwards.
        }
        
        // Text range within a resource.
        interface SourceRange {
            startLine: number; // Start line of range.
            startColumn: number; // Start column of range (inclusive).
            endLine: number; // End line of range
            endColumn: number; // End column of range (exclusive).
        }
        
        interface ShorthandEntry {
            name: string; // Shorthand name.
            value: string; // Shorthand value.
        }
        
        interface CSSPropertyInfo {
            name: string; // Property name.
            longhands?: string[]; // Longhand property names.
            values?: string[]; // Supported values for this property.
        }
        
        interface CSSComputedStyleProperty {
            name: string; // Computed style property name.
            value: string; // Computed style property value.
        }
        
        // CSS style representation.
        interface CSSStyle {
            styleId?: CSSStyleId; // The CSS style identifier (absent for attribute styles).
            cssProperties: CSSProperty[]; // CSS properties in the style.
            shorthandEntries: ShorthandEntry[]; // Computed values for all shorthands found in the style.
            cssText?: string; // Style declaration text (if available).
            range?: SourceRange; // Style declaration range in the enclosing stylesheet (if available).
            width?: string; // The effective "width" property value from this style.
            height?: string; // The effective "height" property value from this style.
        }
        
        type CSSPropertyStatus = string; // The property status: "active" if the property is effective in the style, "inactive" if the property is overridden by a same-named property in this style later on, "disabled" if the property is disabled by the user, "style" (implied if absent) if the property is reported by the browser rather than by the CSS source parser.
        
        // CSS style effective visual dimensions and source offsets.
        interface CSSProperty {
            name: string; // The property name.
            value: string; // The property value.
            priority?: string; // The property priority (implies "" if absent).
            implicit?: boolean; // Whether the property is implicit (implies <code>false</code> if absent).
            text?: string; // The full property text as specified in the style.
            parsedOk?: boolean; // Whether the property is understood by the browser (implies <code>true</code> if absent).
            status?: CSSPropertyStatus; // Whether the property is active or disabled.
            range?: SourceRange; // The entire property range in the enclosing style declaration (if available).
        }
        
        // CSS media query descriptor.
        interface CSSMedia {
            text: string; // Media query text.
            source: string; // Source of the media query: "mediaRule" if specified by a @media rule, "importRule" if specified by an @import rule, "linkedSheet" if specified by a "media" attribute in a linked stylesheet's LINK tag, "inlineSheet" if specified by a "media" attribute in an inline stylesheet's STYLE tag.
            sourceURL?: string; // URL of the document containing the media query description.
            sourceLine?: number; // Line in the document containing the media query (not defined for the "stylesheet" source).
        }
        
        // This object represents a region that flows from a Named Flow.
        interface Region {
            regionOverset: string; // The "overset" attribute of a Named Flow.
            nodeId: DOM.NodeId; // The corresponding DOM node id.
        }
        
        // This object represents a Named Flow.
        interface NamedFlow {
            documentNodeId: DOM.NodeId; // The document node id.
            name: string; // Named Flow identifier.
            overset: boolean; // The "overset" attribute of a Named Flow.
            content: DOM.NodeId[]; // An array of nodes that flow into the Named Flow.
            regions: Region[]; // An array of regions associated with the Named Flow.
        }
        
        // The result from getMatchedStylesForNode method
        interface GetMatchedStylesForNodeResult {
            matchedCSSRules?: RuleMatch[]; // CSS rules matching this node, from all applicable stylesheets.
            pseudoElements?: PseudoIdMatches[]; // Pseudo style matches for this node.
            inherited?: InheritedStyleEntry[]; // A chain of inherited styles (from the immediate node parent up to the DOM tree root).
        }
        
        // Parameters passed to the 'getMatchedStylesForNode' method
        interface GetMatchedStylesForNodeParams {
            nodeId: DOM.NodeId; // 
            includePseudo?: boolean; // Whether to include pseudo styles (default: true).
            includeInherited?: boolean; // Whether to include inherited styles (default: true).
        }
        
        // The result from getInlineStylesForNode method
        interface GetInlineStylesForNodeResult {
            inlineStyle?: CSSStyle; // Inline style for the specified DOM node.
            attributesStyle?: CSSStyle; // Attribute-defined element style (e.g. resulting from "width=20 height=100%").
        }
        
        // Parameters passed to the 'getInlineStylesForNode' method
        interface GetInlineStylesForNodeParams {
            nodeId: DOM.NodeId; // 
        }
        
        // The result from getComputedStyleForNode method
        interface GetComputedStyleForNodeResult {
            computedStyle: CSSComputedStyleProperty[]; // Computed style for the specified DOM node.
        }
        
        // Parameters passed to the 'getComputedStyleForNode' method
        interface GetComputedStyleForNodeParams {
            nodeId: DOM.NodeId; // 
        }
        
        // The result from getAllStyleSheets method
        interface GetAllStyleSheetsResult {
            headers: CSSStyleSheetHeader[]; // Descriptor entries for all available stylesheets.
        }
        
        // The result from getStyleSheet method
        interface GetStyleSheetResult {
            styleSheet: CSSStyleSheetBody; // Stylesheet contents for the specified <code>styleSheetId</code>.
        }
        
        // Parameters passed to the 'getStyleSheet' method
        interface GetStyleSheetParams {
            styleSheetId: StyleSheetId; // 
        }
        
        // The result from getStyleSheetText method
        interface GetStyleSheetTextResult {
            text: string; // The stylesheet text.
        }
        
        // Parameters passed to the 'getStyleSheetText' method
        interface GetStyleSheetTextParams {
            styleSheetId: StyleSheetId; // 
        }
        
        // Parameters passed to the 'setStyleSheetText' method
        interface SetStyleSheetTextParams {
            styleSheetId: StyleSheetId; // 
            text: string; // 
        }
        
        // The result from setStyleText method
        interface SetStyleTextResult {
            style: CSSStyle; // The resulting style after the text modification.
        }
        
        // Parameters passed to the 'setStyleText' method
        interface SetStyleTextParams {
            styleId: CSSStyleId; // 
            text: string; // 
        }
        
        // The result from setRuleSelector method
        interface SetRuleSelectorResult {
            rule: CSSRule; // The resulting rule after the selector modification.
        }
        
        // Parameters passed to the 'setRuleSelector' method
        interface SetRuleSelectorParams {
            ruleId: CSSRuleId; // 
            selector: string; // 
        }
        
        // The result from createStyleSheet method
        interface CreateStyleSheetResult {
            styleSheetId: StyleSheetId; // Identifier of the created "inspector" stylesheet.
        }
        
        // Parameters passed to the 'createStyleSheet' method
        interface CreateStyleSheetParams {
            frameId: Network.FrameId; // Identifier of the frame where the new "inspector" stylesheet should be created.
        }
        
        // The result from addRule method
        interface AddRuleResult {
            rule: CSSRule; // The newly created rule.
        }
        
        // Parameters passed to the 'addRule' method
        interface AddRuleParams {
            styleSheetId: StyleSheetId; // 
            selector: string; // 
        }
        
        // The result from getSupportedCSSProperties method
        interface GetSupportedCSSPropertiesResult {
            cssProperties: CSSPropertyInfo[]; // Supported property metainfo.
        }
        
        // The result from getSupportedSystemFontFamilyNames method
        interface GetSupportedSystemFontFamilyNamesResult {
            fontFamilyNames: string[]; // Supported system font families.
        }
        
        // Parameters passed to the 'forcePseudoState' method
        interface ForcePseudoStateParams {
            nodeId: DOM.NodeId; // The element id for which to force the pseudo state.
            forcedPseudoClasses: string[]; // Element pseudo classes to force when computing the element's style.
        }
        
        // The result from getNamedFlowCollection method
        interface GetNamedFlowCollectionResult {
            namedFlows: NamedFlow[]; // An array containing the Named Flows in the document.
        }
        
        // Parameters passed to the 'getNamedFlowCollection' method
        interface GetNamedFlowCollectionParams {
            documentNodeId: DOM.NodeId; // The document node id for which to get the Named Flow Collection.
        }
        
        // Parameters passed to the 'styleSheetChanged' method
        interface StyleSheetChangedEventArgs {
            styleSheetId: StyleSheetId; // 
        }
        
        // Parameters passed to the 'styleSheetAdded' method
        interface StyleSheetAddedEventArgs {
            header: CSSStyleSheetHeader; // Added stylesheet metainfo.
        }
        
        // Parameters passed to the 'styleSheetRemoved' method
        interface StyleSheetRemovedEventArgs {
            styleSheetId: StyleSheetId; // Identifier of the removed stylesheet.
        }
        
        // Parameters passed to the 'namedFlowCreated' method
        interface NamedFlowCreatedEventArgs {
            namedFlow: NamedFlow; // The new Named Flow.
        }
        
        // Parameters passed to the 'namedFlowRemoved' method
        interface NamedFlowRemovedEventArgs {
            documentNodeId: DOM.NodeId; // The document node id.
            flowName: string; // Identifier of the removed Named Flow.
        }
        
        // Parameters passed to the 'regionOversetChanged' method
        interface RegionOversetChangedEventArgs {
            namedFlow: NamedFlow; // The Named Flow containing the regions whose regionOverset values changed.
        }
        
        // Parameters passed to the 'registeredNamedFlowContentElement' method
        interface RegisteredNamedFlowContentElementEventArgs {
            documentNodeId: DOM.NodeId; // The document node id.
            flowName: string; // Named Flow identifier for which the new content element was registered.
            contentNodeId: DOM.NodeId; // The node id of the registered content node.
            nextContentNodeId: DOM.NodeId; // The node id of the element following the registered content node.
        }
        
        // Parameters passed to the 'unregisteredNamedFlowContentElement' method
        interface UnregisteredNamedFlowContentElementEventArgs {
            documentNodeId: DOM.NodeId; // The document node id.
            flowName: string; // Named Flow identifier for which the new content element was unregistered.
            contentNodeId: DOM.NodeId; // The node id of the unregistered content node.
        }
    }
    
    // Console domain defines methods and events for interaction with the JavaScript console. Console collects messages created by means of the <a href='http://getfirebug.com/wiki/index.php/Console_API'>JavaScript Console API</a>. One needs to enable this domain using <code>enable</code> command in order to start receiving the console messages. Browser collects messages issued while console domain is not enabled as well and reports them using <code>messageAdded</code> notification upon enabling.
    namespace Console {
        
        // Console
        interface Console {
            enable?(): Promise<Webkit.Response<any>>; // // Enables console domain, sends the messages collected so far to the client by means of the <code>messageAdded</code> notification.
            disable?(): Promise<Webkit.Response<any>>; // // Disables console domain, prevents further console messages from being reported to the client.
            clearMessages?(): Promise<Webkit.Response<any>>; // // Clears console messages collected in the browser.
            setMonitoringXHREnabled?(args: SetMonitoringXHREnabledParams ): Promise<Webkit.Response<any>>; // // Toggles monitoring of XMLHttpRequest. If <code>true</code>, console will receive messages upon each XHR issued.
            addInspectedNode?(args: AddInspectedNodeParams ): Promise<Webkit.Response<any>>; // // Enables console to refer to the node with given id via $0 (see Command Line API for more details).
            // Event: messageAdded(MessageAddedEventArgs)
            // Event: messageRepeatCountUpdated(MessageRepeatCountUpdatedEventArgs)
            // Event: messagesCleared()
        }
        
        // Console message.
        interface ConsoleMessage {
            source: string; // Message source.
            level: string; // Message severity.
            text: string; // Message text.
            type?: string; // Console message type.
            url?: string; // URL of the message origin.
            line?: number; // Line number in the resource that generated this message.
            column?: number; // Column number on the line in the resource that generated this message.
            repeatCount?: number; // Repeat count for repeated messages.
            parameters?: Runtime.RemoteObject[]; // Message parameters in case of the formatted message.
            stackTrace?: StackTrace; // JavaScript stack trace for assertions and error messages.
            networkRequestId?: Network.RequestId; // Identifier of the network request associated with this message.
        }
        
        // Stack entry for console errors and assertions.
        interface CallFrame {
            functionName: string; // JavaScript function name.
            url: string; // JavaScript script name or url.
            lineNumber: number; // JavaScript script line number.
            columnNumber: number; // JavaScript script column number.
        }
        
        type StackTrace = CallFrame[]; // Call frames for assertions or error messages.
        
        // Parameters passed to the 'setMonitoringXHREnabled' method
        interface SetMonitoringXHREnabledParams {
            enabled: boolean; // Monitoring enabled state.
        }
        
        // Parameters passed to the 'addInspectedNode' method
        interface AddInspectedNodeParams {
            nodeId: DOM.NodeId; // DOM node id to be accessible by means of $0 command line API.
        }
        
        // Parameters passed to the 'messageAdded' method
        interface MessageAddedEventArgs {
            message: ConsoleMessage; // Console message that has been added.
        }
        
        // Parameters passed to the 'messageRepeatCountUpdated' method
        interface MessageRepeatCountUpdatedEventArgs {
            count: number; // New repeat count value.
        }
    }
    
    // This domain exposes DOM read/write operations. Each DOM Node is represented with its mirror object that has an <code>id</code>. This <code>id</code> can be used to get additional information on the Node, resolve it into the JavaScript object wrapper, etc. It is important that client receives DOM events only for the nodes that are known to the client. Backend keeps track of the nodes that were sent to the client and never sends the same node twice. It is client's responsibility to collect information about the nodes that were sent to the client.<p>Note that <code>iframe</code> owner elements will return corresponding document elements as their child nodes.</p>
    namespace DOM {
        
        // DOM
        interface DOM {
            getDocument?(): Promise<Webkit.Response<GetDocumentResult>>; // // Returns the root DOM node to the caller.
            requestChildNodes?(args: RequestChildNodesParams ): Promise<Webkit.Response<any>>; // // Requests that children of the node with given id are returned to the caller in form of <code>setChildNodes</code> events where not only immediate children are retrieved, but all children down to the specified depth.
            querySelector?(args: QuerySelectorParams ): Promise<Webkit.Response<QuerySelectorResult>>; // // Executes <code>querySelector</code> on a given node.
            querySelectorAll?(args: QuerySelectorAllParams ): Promise<Webkit.Response<QuerySelectorAllResult>>; // // Executes <code>querySelectorAll</code> on a given node.
            setNodeName?(args: SetNodeNameParams ): Promise<Webkit.Response<SetNodeNameResult>>; // // Sets node name for a node with given id.
            setNodeValue?(args: SetNodeValueParams ): Promise<Webkit.Response<any>>; // // Sets node value for a node with given id.
            removeNode?(args: RemoveNodeParams ): Promise<Webkit.Response<any>>; // // Removes node with given id.
            setAttributeValue?(args: SetAttributeValueParams ): Promise<Webkit.Response<any>>; // // Sets attribute for an element with given id.
            setAttributesAsText?(args: SetAttributesAsTextParams ): Promise<Webkit.Response<any>>; // // Sets attributes on element with given id. This method is useful when user edits some existing attribute value and types in several attribute name/value pairs.
            removeAttribute?(args: RemoveAttributeParams ): Promise<Webkit.Response<any>>; // // Removes attribute with given name from an element with given id.
            getEventListenersForNode?(args: GetEventListenersForNodeParams ): Promise<Webkit.Response<GetEventListenersForNodeResult>>; // // Returns event listeners relevant to the node.
            getAccessibilityPropertiesForNode?(args: GetAccessibilityPropertiesForNodeParams ): Promise<Webkit.Response<GetAccessibilityPropertiesForNodeResult>>; // // Returns a dictionary of accessibility properties for the node.
            getOuterHTML?(args: GetOuterHTMLParams ): Promise<Webkit.Response<GetOuterHTMLResult>>; // // Returns node's HTML markup.
            setOuterHTML?(args: SetOuterHTMLParams ): Promise<Webkit.Response<any>>; // // Sets node HTML markup, returns new node id.
            performSearch?(args: PerformSearchParams ): Promise<Webkit.Response<PerformSearchResult>>; // // Searches for a given string in the DOM tree. Use <code>getSearchResults</code> to access search results or <code>cancelSearch</code> to end this search session.
            getSearchResults?(args: GetSearchResultsParams ): Promise<Webkit.Response<GetSearchResultsResult>>; // // Returns search results from given <code>fromIndex</code> to given <code>toIndex</code> from the sarch with the given identifier.
            discardSearchResults?(args: DiscardSearchResultsParams ): Promise<Webkit.Response<any>>; // // Discards search results from the session with the given id. <code>getSearchResults</code> should no longer be called for that search.
            requestNode?(args: RequestNodeParams ): Promise<Webkit.Response<RequestNodeResult>>; // // Requests that the node is sent to the caller given the JavaScript node object reference. All nodes that form the path from the node to the root are also sent to the client as a series of <code>setChildNodes</code> notifications.
            setInspectModeEnabled?(args: SetInspectModeEnabledParams ): Promise<Webkit.Response<any>>; // // Enters the 'inspect' mode. In this mode, elements that user is hovering over are highlighted. Backend then generates 'inspect' command upon element selection.
            highlightRect?(args: HighlightRectParams ): Promise<Webkit.Response<any>>; // // Highlights given rectangle. Coordinates are absolute with respect to the main frame viewport.
            highlightQuad?(args: HighlightQuadParams ): Promise<Webkit.Response<any>>; // // Highlights given quad. Coordinates are absolute with respect to the main frame viewport.
            highlightSelector?(args: HighlightSelectorParams ): Promise<Webkit.Response<any>>; // // Highlights all DOM nodes that match a given selector. A string containing a CSS selector must be specified.
            highlightNode?(args: HighlightNodeParams ): Promise<Webkit.Response<any>>; // // Highlights DOM node with given id or with the given JavaScript object wrapper. Either nodeId or objectId must be specified.
            hideHighlight?(): Promise<Webkit.Response<any>>; // // Hides DOM node highlight.
            highlightFrame?(args: HighlightFrameParams ): Promise<Webkit.Response<any>>; // // Highlights owner element of the frame with given id.
            pushNodeByPathToFrontend?(args: PushNodeByPathToFrontendParams ): Promise<Webkit.Response<PushNodeByPathToFrontendResult>>; // // Requests that the node is sent to the caller given its path. // FIXME, use XPath
            pushNodeByBackendIdToFrontend?(args: PushNodeByBackendIdToFrontendParams ): Promise<Webkit.Response<PushNodeByBackendIdToFrontendResult>>; // // Requests that the node is sent to the caller given its backend node id.
            releaseBackendNodeIds?(args: ReleaseBackendNodeIdsParams ): Promise<Webkit.Response<any>>; // // Requests that group of <code>BackendNodeIds</code> is released.
            resolveNode?(args: ResolveNodeParams ): Promise<Webkit.Response<ResolveNodeResult>>; // // Resolves JavaScript node object for given node id.
            getAttributes?(args: GetAttributesParams ): Promise<Webkit.Response<GetAttributesResult>>; // // Returns attributes for the specified node.
            moveTo?(args: MoveToParams ): Promise<Webkit.Response<MoveToResult>>; // // Moves node into the new container, places it before the given anchor.
            undo?(): Promise<Webkit.Response<any>>; // // Undoes the last performed action.
            redo?(): Promise<Webkit.Response<any>>; // // Re-does the last undone action.
            markUndoableState?(): Promise<Webkit.Response<any>>; // // Marks last undoable state.
            focus?(args: FocusParams ): Promise<Webkit.Response<any>>; // // Focuses the given element.
            // Event: documentUpdated()
            // Event: setChildNodes(SetChildNodesEventArgs)
            // Event: attributeModified(AttributeModifiedEventArgs)
            // Event: attributeRemoved(AttributeRemovedEventArgs)
            // Event: inlineStyleInvalidated(InlineStyleInvalidatedEventArgs)
            // Event: characterDataModified(CharacterDataModifiedEventArgs)
            // Event: childNodeCountUpdated(ChildNodeCountUpdatedEventArgs)
            // Event: childNodeInserted(ChildNodeInsertedEventArgs)
            // Event: childNodeRemoved(ChildNodeRemovedEventArgs)
            // Event: shadowRootPushed(ShadowRootPushedEventArgs)
            // Event: shadowRootPopped(ShadowRootPoppedEventArgs)
            // Event: pseudoElementAdded(PseudoElementAddedEventArgs)
            // Event: pseudoElementRemoved(PseudoElementRemovedEventArgs)
        }
        
        type NodeId = number; // Unique DOM node identifier.
        
        type BackendNodeId = number; // Unique DOM node identifier used to reference a node that may not have been pushed to the front-end.
        
        type PseudoType = string; // Pseudo element type.
        
        type LiveRegionRelevant = string; // Token values of @aria-relevant attribute.
        
        // DOM interaction is implemented in terms of mirror objects that represent the actual DOM nodes. DOMNode is a base node mirror type.
        interface Node {
            nodeId: NodeId; // Node identifier that is passed into the rest of the DOM messages as the <code>nodeId</code>. Backend will only push node with given <code>id</code> once. It is aware of all requested nodes and will only fire DOM events for nodes known to the client.
            nodeType: number; // <code>Node</code>'s nodeType.
            nodeName: string; // <code>Node</code>'s nodeName.
            localName: string; // <code>Node</code>'s localName.
            nodeValue: string; // <code>Node</code>'s nodeValue.
            childNodeCount?: number; // Child count for <code>Container</code> nodes.
            children?: Node[]; // Child nodes of this node when requested with children.
            attributes?: string[]; // Attributes of the <code>Element</code> node in the form of flat array <code>[name1, value1, name2, value2]</code>.
            documentURL?: string; // Document URL that <code>Document</code> or <code>FrameOwner</code> node points to.
            baseURL?: string; // Base URL that <code>Document</code> or <code>FrameOwner</code> node uses for URL completion.
            publicId?: string; // <code>DocumentType</code>'s publicId.
            systemId?: string; // <code>DocumentType</code>'s systemId.
            internalSubset?: string; // <code>DocumentType</code>'s internalSubset.
            xmlVersion?: string; // <code>Document</code>'s XML version in case of XML documents.
            name?: string; // <code>Attr</code>'s name.
            value?: string; // <code>Attr</code>'s value.
            pseudoType?: PseudoType; // Pseudo element type for this node.
            frameId?: Network.FrameId; // Frame ID for frame owner elements.
            contentDocument?: Node; // Content document for frame owner elements.
            shadowRoots?: Node[]; // Shadow root list for given element host.
            templateContent?: Node; // Content document fragment for template elements
            pseudoElements?: Node[]; // Pseudo elements associated with this node.
            role?: string; // Computed value for first recognized role token, default role per element, or overridden role.
        }
        
        // A structure holding event listener properties.
        interface EventListener {
            type: string; // <code>EventListener</code>'s type.
            useCapture: boolean; // <code>EventListener</code>'s useCapture.
            isAttribute: boolean; // <code>EventListener</code>'s isAttribute.
            nodeId: NodeId; // Target <code>DOMNode</code> id.
            handlerBody: string; // Event handler function body.
            location?: Debugger.Location; // Handler code location.
            sourceName?: string; // Source script URL.
            handler?: Runtime.RemoteObject; // Event handler function value.
        }
        
        // A structure holding accessibility properties.
        interface AccessibilityProperties {
            activeDescendantNodeId?: NodeId; // <code>DOMNode</code> id of the accessibility object referenced by aria-activedescendant.
            busy?: boolean; // Value of @aria-busy on current or ancestor node.
            checked?: string; // Checked state of certain form controls.
            childNodeIds?: NodeId[]; // Array of <code>DOMNode</code> ids of the accessibility tree children if available.
            controlledNodeIds?: NodeId[]; // Array of <code>DOMNode</code> ids of any nodes referenced via @aria-controls.
            current?: string; // Current item within a container or set of related elements.
            disabled?: boolean; // Disabled state of form controls.
            exists: boolean; // Indicates whether there is an existing AX object for the DOM node. If this is false, all the other properties will be default values.
            expanded?: boolean; // Expanded state.
            flowedNodeIds?: NodeId[]; // Array of <code>DOMNode</code> ids of any nodes referenced via @aria-flowto.
            focused?: boolean; // Focused state. Only defined on focusable elements.
            ignored?: boolean; // Indicates whether the accessibility of the associated AX object node is ignored, whether heuristically or explicitly.
            ignoredByDefault?: boolean; // State indicating whether the accessibility of the associated AX object node is ignored by default for node type.
            invalid?: string; // Invalid status of form controls.
            hidden?: boolean; // Hidden state. True if node or an ancestor is hidden via CSS or explicit @aria-hidden, to clarify why the element is ignored.
            label: string; // Computed label value for the node, sometimes calculated by referencing other nodes.
            liveRegionAtomic?: boolean; // Value of @aria-atomic.
            liveRegionRelevant?: string[]; // Token value(s) of element's @aria-relevant attribute. Array of string values matching $ref LiveRegionRelevant. FIXME: Enum values blocked by http://webkit.org/b/133711
            liveRegionStatus?: string; // Value of element's @aria-live attribute.
            mouseEventNodeId?: NodeId; // <code>DOMNode</code> id of node or closest ancestor node that has a mousedown, mouseup, or click event handler.
            nodeId: NodeId; // Target <code>DOMNode</code> id.
            ownedNodeIds?: NodeId[]; // Array of <code>DOMNode</code> ids of any nodes referenced via @aria-owns.
            parentNodeId?: NodeId; // <code>DOMNode</code> id of the accessibility tree parent object if available.
            pressed?: boolean; // Pressed state for toggle buttons.
            readonly?: boolean; // Readonly state of text controls.
            required?: boolean; // Required state of form controls.
            role: string; // Computed value for first recognized role token, default role per element, or overridden role.
            selected?: boolean; // Selected state of certain form controls.
            selectedChildNodeIds?: NodeId[]; // Array of <code>DOMNode</code> ids of any children marked as selected.
        }
        
        // A structure holding an RGBA color.
        interface RGBAColor {
            r: number; // The red component, in the [0-255] range.
            g: number; // The green component, in the [0-255] range.
            b: number; // The blue component, in the [0-255] range.
            a?: number; // The alpha component, in the [0-1] range (default: 1).
        }
        
        type Quad = number[]; // An array of quad vertices, x immediately followed by y for each point, points clock-wise.
        
        // Configuration data for the highlighting of page elements.
        interface HighlightConfig {
            showInfo?: boolean; // Whether the node info tooltip should be shown (default: false).
            contentColor?: RGBAColor; // The content box highlight fill color (default: transparent).
            paddingColor?: RGBAColor; // The padding highlight fill color (default: transparent).
            borderColor?: RGBAColor; // The border highlight fill color (default: transparent).
            marginColor?: RGBAColor; // The margin highlight fill color (default: transparent).
        }
        
        // The result from getDocument method
        interface GetDocumentResult {
            root: Node; // Resulting node.
        }
        
        // Parameters passed to the 'requestChildNodes' method
        interface RequestChildNodesParams {
            nodeId: NodeId; // Id of the node to get children for.
            depth?: number; // The maximum depth at which children should be retrieved, defaults to 1. Use -1 for the entire subtree or provide an integer larger than 0.
        }
        
        // The result from querySelector method
        interface QuerySelectorResult {
            nodeId: NodeId; // Query selector result.
        }
        
        // Parameters passed to the 'querySelector' method
        interface QuerySelectorParams {
            nodeId: NodeId; // Id of the node to query upon.
            selector: string; // Selector string.
        }
        
        // The result from querySelectorAll method
        interface QuerySelectorAllResult {
            nodeIds: NodeId[]; // Query selector result.
        }
        
        // Parameters passed to the 'querySelectorAll' method
        interface QuerySelectorAllParams {
            nodeId: NodeId; // Id of the node to query upon.
            selector: string; // Selector string.
        }
        
        // The result from setNodeName method
        interface SetNodeNameResult {
            nodeId: NodeId; // New node's id.
        }
        
        // Parameters passed to the 'setNodeName' method
        interface SetNodeNameParams {
            nodeId: NodeId; // Id of the node to set name for.
            name: string; // New node's name.
        }
        
        // Parameters passed to the 'setNodeValue' method
        interface SetNodeValueParams {
            nodeId: NodeId; // Id of the node to set value for.
            value: string; // New node's value.
        }
        
        // Parameters passed to the 'removeNode' method
        interface RemoveNodeParams {
            nodeId: NodeId; // Id of the node to remove.
        }
        
        // Parameters passed to the 'setAttributeValue' method
        interface SetAttributeValueParams {
            nodeId: NodeId; // Id of the element to set attribute for.
            name: string; // Attribute name.
            value: string; // Attribute value.
        }
        
        // Parameters passed to the 'setAttributesAsText' method
        interface SetAttributesAsTextParams {
            nodeId: NodeId; // Id of the element to set attributes for.
            text: string; // Text with a number of attributes. Will parse this text using HTML parser.
            name?: string; // Attribute name to replace with new attributes derived from text in case text parsed successfully.
        }
        
        // Parameters passed to the 'removeAttribute' method
        interface RemoveAttributeParams {
            nodeId: NodeId; // Id of the element to remove attribute from.
            name: string; // Name of the attribute to remove.
        }
        
        // The result from getEventListenersForNode method
        interface GetEventListenersForNodeResult {
            listeners: EventListener[]; // Array of relevant listeners.
        }
        
        // Parameters passed to the 'getEventListenersForNode' method
        interface GetEventListenersForNodeParams {
            nodeId: NodeId; // Id of the node to get listeners for.
            objectGroup?: string; // Symbolic group name for handler value. Handler value is not returned without this parameter specified.
        }
        
        // The result from getAccessibilityPropertiesForNode method
        interface GetAccessibilityPropertiesForNodeResult {
            properties: AccessibilityProperties; // Dictionary of relevant accessibility properties.
        }
        
        // Parameters passed to the 'getAccessibilityPropertiesForNode' method
        interface GetAccessibilityPropertiesForNodeParams {
            nodeId: NodeId; // Id of the node for which to get accessibility properties.
        }
        
        // The result from getOuterHTML method
        interface GetOuterHTMLResult {
            outerHTML: string; // Outer HTML markup.
        }
        
        // Parameters passed to the 'getOuterHTML' method
        interface GetOuterHTMLParams {
            nodeId: NodeId; // Id of the node to get markup for.
        }
        
        // Parameters passed to the 'setOuterHTML' method
        interface SetOuterHTMLParams {
            nodeId: NodeId; // Id of the node to set markup for.
            outerHTML: string; // Outer HTML markup to set.
        }
        
        // The result from performSearch method
        interface PerformSearchResult {
            searchId: string; // Unique search session identifier.
            resultCount: number; // Number of search results.
        }
        
        // Parameters passed to the 'performSearch' method
        interface PerformSearchParams {
            query: string; // Plain text or query selector or XPath search query.
            nodeIds?: NodeId[]; // Ids of nodes to use as starting points for the search.
        }
        
        // The result from getSearchResults method
        interface GetSearchResultsResult {
            nodeIds: NodeId[]; // Ids of the search result nodes.
        }
        
        // Parameters passed to the 'getSearchResults' method
        interface GetSearchResultsParams {
            searchId: string; // Unique search session identifier.
            fromIndex: number; // Start index of the search result to be returned.
            toIndex: number; // End index of the search result to be returned.
        }
        
        // Parameters passed to the 'discardSearchResults' method
        interface DiscardSearchResultsParams {
            searchId: string; // Unique search session identifier.
        }
        
        // The result from requestNode method
        interface RequestNodeResult {
            nodeId: NodeId; // Node id for given object.
        }
        
        // Parameters passed to the 'requestNode' method
        interface RequestNodeParams {
            objectId: Runtime.RemoteObjectId; // JavaScript object id to convert into node.
        }
        
        // Parameters passed to the 'setInspectModeEnabled' method
        interface SetInspectModeEnabledParams {
            enabled: boolean; // True to enable inspection mode, false to disable it.
            highlightConfig?: HighlightConfig; // A descriptor for the highlight appearance of hovered-over nodes. May be omitted if <code>enabled == false</code>.
        }
        
        // Parameters passed to the 'highlightRect' method
        interface HighlightRectParams {
            x: number; // X coordinate
            y: number; // Y coordinate
            width: number; // Rectangle width
            height: number; // Rectangle height
            color?: RGBAColor; // The highlight fill color (default: transparent).
            outlineColor?: RGBAColor; // The highlight outline color (default: transparent).
            usePageCoordinates?: boolean; // Indicates whether the provided parameters are in page coordinates or in viewport coordinates (the default).
        }
        
        // Parameters passed to the 'highlightQuad' method
        interface HighlightQuadParams {
            quad: Quad; // Quad to highlight
            color?: RGBAColor; // The highlight fill color (default: transparent).
            outlineColor?: RGBAColor; // The highlight outline color (default: transparent).
            usePageCoordinates?: boolean; // Indicates whether the provided parameters are in page coordinates or in viewport coordinates (the default).
        }
        
        // Parameters passed to the 'highlightSelector' method
        interface HighlightSelectorParams {
            highlightConfig: HighlightConfig; // A descriptor for the highlight appearance.
            selectorString: string; // A CSS selector for finding matching nodes to highlight.
            frameId?: string; // Identifier of the frame which will be searched using the selector.  If not provided, the main frame will be used.
        }
        
        // Parameters passed to the 'highlightNode' method
        interface HighlightNodeParams {
            highlightConfig: HighlightConfig; // A descriptor for the highlight appearance.
            nodeId?: NodeId; // Identifier of the node to highlight.
            objectId?: Runtime.RemoteObjectId; // JavaScript object id of the node to be highlighted.
        }
        
        // Parameters passed to the 'highlightFrame' method
        interface HighlightFrameParams {
            frameId: Network.FrameId; // Identifier of the frame to highlight.
            contentColor?: RGBAColor; // The content box highlight fill color (default: transparent).
            contentOutlineColor?: RGBAColor; // The content box highlight outline color (default: transparent).
        }
        
        // The result from pushNodeByPathToFrontend method
        interface PushNodeByPathToFrontendResult {
            nodeId: NodeId; // Id of the node for given path.
        }
        
        // Parameters passed to the 'pushNodeByPathToFrontend' method
        interface PushNodeByPathToFrontendParams {
            path: string; // Path to node in the proprietary format.
        }
        
        // The result from pushNodeByBackendIdToFrontend method
        interface PushNodeByBackendIdToFrontendResult {
            nodeId: NodeId; // The pushed node's id.
        }
        
        // Parameters passed to the 'pushNodeByBackendIdToFrontend' method
        interface PushNodeByBackendIdToFrontendParams {
            backendNodeId: BackendNodeId; // The backend node id of the node.
        }
        
        // Parameters passed to the 'releaseBackendNodeIds' method
        interface ReleaseBackendNodeIdsParams {
            nodeGroup: string; // The backend node ids group name.
        }
        
        // The result from resolveNode method
        interface ResolveNodeResult {
            object: Runtime.RemoteObject; // JavaScript object wrapper for given node.
        }
        
        // Parameters passed to the 'resolveNode' method
        interface ResolveNodeParams {
            nodeId: NodeId; // Id of the node to resolve.
            objectGroup?: string; // Symbolic group name that can be used to release multiple objects.
        }
        
        // The result from getAttributes method
        interface GetAttributesResult {
            attributes: string[]; // An interleaved array of node attribute names and values.
        }
        
        // Parameters passed to the 'getAttributes' method
        interface GetAttributesParams {
            nodeId: NodeId; // Id of the node to retrieve attibutes for.
        }
        
        // The result from moveTo method
        interface MoveToResult {
            nodeId: NodeId; // New id of the moved node.
        }
        
        // Parameters passed to the 'moveTo' method
        interface MoveToParams {
            nodeId: NodeId; // Id of the node to drop.
            targetNodeId: NodeId; // Id of the element to drop into.
            insertBeforeNodeId?: NodeId; // Drop node before given one.
        }
        
        // Parameters passed to the 'focus' method
        interface FocusParams {
            nodeId: NodeId; // Id of the node to focus.
        }
        
        // Parameters passed to the 'setChildNodes' method
        interface SetChildNodesEventArgs {
            parentId: NodeId; // Parent node id to populate with children.
            nodes: Node[]; // Child nodes array.
        }
        
        // Parameters passed to the 'attributeModified' method
        interface AttributeModifiedEventArgs {
            nodeId: NodeId; // Id of the node that has changed.
            name: string; // Attribute name.
            value: string; // Attribute value.
        }
        
        // Parameters passed to the 'attributeRemoved' method
        interface AttributeRemovedEventArgs {
            nodeId: NodeId; // Id of the node that has changed.
            name: string; // A ttribute name.
        }
        
        // Parameters passed to the 'inlineStyleInvalidated' method
        interface InlineStyleInvalidatedEventArgs {
            nodeIds: NodeId[]; // Ids of the nodes for which the inline styles have been invalidated.
        }
        
        // Parameters passed to the 'characterDataModified' method
        interface CharacterDataModifiedEventArgs {
            nodeId: NodeId; // Id of the node that has changed.
            characterData: string; // New text value.
        }
        
        // Parameters passed to the 'childNodeCountUpdated' method
        interface ChildNodeCountUpdatedEventArgs {
            nodeId: NodeId; // Id of the node that has changed.
            childNodeCount: number; // New node count.
        }
        
        // Parameters passed to the 'childNodeInserted' method
        interface ChildNodeInsertedEventArgs {
            parentNodeId: NodeId; // Id of the node that has changed.
            previousNodeId: NodeId; // If of the previous siblint.
            node: Node; // Inserted node data.
        }
        
        // Parameters passed to the 'childNodeRemoved' method
        interface ChildNodeRemovedEventArgs {
            parentNodeId: NodeId; // Parent id.
            nodeId: NodeId; // Id of the node that has been removed.
        }
        
        // Parameters passed to the 'shadowRootPushed' method
        interface ShadowRootPushedEventArgs {
            hostId: NodeId; // Host element id.
            root: Node; // Shadow root.
        }
        
        // Parameters passed to the 'shadowRootPopped' method
        interface ShadowRootPoppedEventArgs {
            hostId: NodeId; // Host element id.
            rootId: NodeId; // Shadow root id.
        }
        
        // Parameters passed to the 'pseudoElementAdded' method
        interface PseudoElementAddedEventArgs {
            parentId: NodeId; // Pseudo element's parent element id.
            pseudoElement: Node; // The added pseudo element.
        }
        
        // Parameters passed to the 'pseudoElementRemoved' method
        interface PseudoElementRemovedEventArgs {
            parentId: NodeId; // Pseudo element's parent element id.
            pseudoElementId: NodeId; // The removed pseudo element id.
        }
    }
    
    // DOM debugging allows setting breakpoints on particular DOM operations and events. JavaScript execution will stop on these operations as if there was a regular breakpoint set.
    namespace DOMDebugger {
        
        // DOMDebugger
        interface DOMDebugger {
            setDOMBreakpoint?(args: SetDOMBreakpointParams ): Promise<Webkit.Response<any>>; // // Sets breakpoint on particular operation with DOM.
            removeDOMBreakpoint?(args: RemoveDOMBreakpointParams ): Promise<Webkit.Response<any>>; // // Removes DOM breakpoint that was set using <code>setDOMBreakpoint</code>.
            setEventListenerBreakpoint?(args: SetEventListenerBreakpointParams ): Promise<Webkit.Response<any>>; // // Sets breakpoint on particular DOM event.
            removeEventListenerBreakpoint?(args: RemoveEventListenerBreakpointParams ): Promise<Webkit.Response<any>>; // // Removes breakpoint on particular DOM event.
            setInstrumentationBreakpoint?(args: SetInstrumentationBreakpointParams ): Promise<Webkit.Response<any>>; // // Sets breakpoint on particular native event.
            removeInstrumentationBreakpoint?(args: RemoveInstrumentationBreakpointParams ): Promise<Webkit.Response<any>>; // // Sets breakpoint on particular native event.
            setXHRBreakpoint?(args: SetXHRBreakpointParams ): Promise<Webkit.Response<any>>; // // Sets breakpoint on XMLHttpRequest.
            removeXHRBreakpoint?(args: RemoveXHRBreakpointParams ): Promise<Webkit.Response<any>>; // // Removes breakpoint from XMLHttpRequest.
        }
        
        type DOMBreakpointType = string; // DOM breakpoint type.
        
        // Parameters passed to the 'setDOMBreakpoint' method
        interface SetDOMBreakpointParams {
            nodeId: DOM.NodeId; // Identifier of the node to set breakpoint on.
            type: DOMBreakpointType; // Type of the operation to stop upon.
        }
        
        // Parameters passed to the 'removeDOMBreakpoint' method
        interface RemoveDOMBreakpointParams {
            nodeId: DOM.NodeId; // Identifier of the node to remove breakpoint from.
            type: DOMBreakpointType; // Type of the breakpoint to remove.
        }
        
        // Parameters passed to the 'setEventListenerBreakpoint' method
        interface SetEventListenerBreakpointParams {
            eventName: string; // DOM Event name to stop on (any DOM event will do).
        }
        
        // Parameters passed to the 'removeEventListenerBreakpoint' method
        interface RemoveEventListenerBreakpointParams {
            eventName: string; // Event name.
        }
        
        // Parameters passed to the 'setInstrumentationBreakpoint' method
        interface SetInstrumentationBreakpointParams {
            eventName: string; // Instrumentation name to stop on.
        }
        
        // Parameters passed to the 'removeInstrumentationBreakpoint' method
        interface RemoveInstrumentationBreakpointParams {
            eventName: string; // Instrumentation name to stop on.
        }
        
        // Parameters passed to the 'setXHRBreakpoint' method
        interface SetXHRBreakpointParams {
            url: string; // Resource URL substring. All XHRs having this substring in the URL will get stopped upon.
        }
        
        // Parameters passed to the 'removeXHRBreakpoint' method
        interface RemoveXHRBreakpointParams {
            url: string; // Resource URL substring.
        }
    }
    
    // Query and modify DOM storage.
    namespace DOMStorage {
        
        // DOMStorage
        interface DOMStorage {
            enable?(): Promise<Webkit.Response<any>>; // // Enables storage tracking, storage events will now be delivered to the client.
            disable?(): Promise<Webkit.Response<any>>; // // Disables storage tracking, prevents storage events from being sent to the client.
            getDOMStorageItems?(args: GetDOMStorageItemsParams ): Promise<Webkit.Response<GetDOMStorageItemsResult>>; // 
            setDOMStorageItem?(args: SetDOMStorageItemParams ): Promise<Webkit.Response<any>>; // 
            removeDOMStorageItem?(args: RemoveDOMStorageItemParams ): Promise<Webkit.Response<any>>; // 
            // Event: domStorageItemsCleared(DomStorageItemsClearedEventArgs)
            // Event: domStorageItemRemoved(DomStorageItemRemovedEventArgs)
            // Event: domStorageItemAdded(DomStorageItemAddedEventArgs)
            // Event: domStorageItemUpdated(DomStorageItemUpdatedEventArgs)
        }
        
        // DOM Storage identifier.
        interface StorageId {
            securityOrigin: string; // Security origin for the storage.
            isLocalStorage: boolean; // Whether the storage is local storage (not session storage).
        }
        
        type Item = string[]; // DOM Storage item.
        
        // The result from getDOMStorageItems method
        interface GetDOMStorageItemsResult {
            entries: Item[]; // 
        }
        
        // Parameters passed to the 'getDOMStorageItems' method
        interface GetDOMStorageItemsParams {
            storageId: StorageId; // 
        }
        
        // Parameters passed to the 'setDOMStorageItem' method
        interface SetDOMStorageItemParams {
            storageId: StorageId; // 
            key: string; // 
            value: string; // 
        }
        
        // Parameters passed to the 'removeDOMStorageItem' method
        interface RemoveDOMStorageItemParams {
            storageId: StorageId; // 
            key: string; // 
        }
        
        // Parameters passed to the 'domStorageItemsCleared' method
        interface DomStorageItemsClearedEventArgs {
            storageId: StorageId; // 
        }
        
        // Parameters passed to the 'domStorageItemRemoved' method
        interface DomStorageItemRemovedEventArgs {
            storageId: StorageId; // 
            key: string; // 
        }
        
        // Parameters passed to the 'domStorageItemAdded' method
        interface DomStorageItemAddedEventArgs {
            storageId: StorageId; // 
            key: string; // 
            newValue: string; // 
        }
        
        // Parameters passed to the 'domStorageItemUpdated' method
        interface DomStorageItemUpdatedEventArgs {
            storageId: StorageId; // 
            key: string; // 
            oldValue: string; // 
            newValue: string; // 
        }
    }
    
    namespace Database {
        
        // Database
        interface Database {
            enable?(): Promise<Webkit.Response<any>>; // // Enables database tracking, database events will now be delivered to the client.
            disable?(): Promise<Webkit.Response<any>>; // // Disables database tracking, prevents database events from being sent to the client.
            getDatabaseTableNames?(args: GetDatabaseTableNamesParams ): Promise<Webkit.Response<GetDatabaseTableNamesResult>>; // 
            executeSQL?(args: ExecuteSQLParams ): Promise<Webkit.Response<ExecuteSQLResult>>; // 
            // Event: addDatabase(AddDatabaseEventArgs)
        }
        
        type DatabaseId = string; // Unique identifier of Database object.
        
        // Database object.
        interface Database {
            id: DatabaseId; // Database ID.
            domain: string; // Database domain.
            name: string; // Database name.
            version: string; // Database version.
        }
        
        // Database error.
        interface Error {
            message: string; // Error message.
            code: number; // Error code.
        }
        
        // The result from getDatabaseTableNames method
        interface GetDatabaseTableNamesResult {
            tableNames: string[]; // 
        }
        
        // Parameters passed to the 'getDatabaseTableNames' method
        interface GetDatabaseTableNamesParams {
            databaseId: DatabaseId; // 
        }
        
        // The result from executeSQL method
        interface ExecuteSQLResult {
            columnNames?: string[]; // 
            values?: any[]; // 
            sqlError?: Error; // 
        }
        
        // Parameters passed to the 'executeSQL' method
        interface ExecuteSQLParams {
            databaseId: DatabaseId; // 
            query: string; // 
        }
        
        // Parameters passed to the 'addDatabase' method
        interface AddDatabaseEventArgs {
            database: Database; // 
        }
    }
    
    // Debugger domain exposes JavaScript debugging capabilities. It allows setting and removing breakpoints, stepping through execution, exploring stack traces, etc.
    namespace Debugger {
        
        // Debugger
        interface Debugger {
            enable?(): Promise<Webkit.Response<any>>; // // Enables debugger for the given page. Clients should not assume that the debugging has been enabled until the result for this command is received.
            disable?(): Promise<Webkit.Response<any>>; // // Disables debugger for given page.
            setBreakpointsActive?(args: SetBreakpointsActiveParams ): Promise<Webkit.Response<any>>; // // Activates / deactivates all breakpoints on the page.
            setBreakpointByUrl?(args: SetBreakpointByUrlParams ): Promise<Webkit.Response<SetBreakpointByUrlResult>>; // // Sets JavaScript breakpoint at given location specified either by URL or URL regex. Once this command is issued, all existing parsed scripts will have breakpoints resolved and returned in <code>locations</code> property. Further matching script parsing will result in subsequent <code>breakpointResolved</code> events issued. This logical breakpoint will survive page reloads.
            setBreakpoint?(args: SetBreakpointParams ): Promise<Webkit.Response<SetBreakpointResult>>; // // Sets JavaScript breakpoint at a given location.
            removeBreakpoint?(args: RemoveBreakpointParams ): Promise<Webkit.Response<any>>; // // Removes JavaScript breakpoint.
            continueToLocation?(args: ContinueToLocationParams ): Promise<Webkit.Response<any>>; // // Continues execution until specific location is reached.
            stepOver?(): Promise<Webkit.Response<any>>; // // Steps over the statement.
            stepInto?(): Promise<Webkit.Response<any>>; // // Steps into the function call.
            stepOut?(): Promise<Webkit.Response<any>>; // // Steps out of the function call.
            pause?(): Promise<Webkit.Response<any>>; // // Stops on the next JavaScript statement.
            resume?(): Promise<Webkit.Response<any>>; // // Resumes JavaScript execution.
            searchInContent?(args: SearchInContentParams ): Promise<Webkit.Response<SearchInContentResult>>; // // Searches for given string in script content.
            getScriptSource?(args: GetScriptSourceParams ): Promise<Webkit.Response<GetScriptSourceResult>>; // // Returns source for the script with given id.
            getFunctionDetails?(args: GetFunctionDetailsParams ): Promise<Webkit.Response<GetFunctionDetailsResult>>; // // Returns detailed information on given function.
            setPauseOnExceptions?(args: SetPauseOnExceptionsParams ): Promise<Webkit.Response<any>>; // // Defines pause on exceptions state. Can be set to stop on all exceptions, uncaught exceptions or no exceptions. Initial pause on exceptions state is <code>none</code>.
            evaluateOnCallFrame?(args: EvaluateOnCallFrameParams ): Promise<Webkit.Response<EvaluateOnCallFrameResult>>; // // Evaluates expression on a given call frame.
            setOverlayMessage?(args: SetOverlayMessageParams ): Promise<Webkit.Response<any>>; // // Sets overlay message.
            // Event: globalObjectCleared()
            // Event: scriptParsed(ScriptParsedEventArgs)
            // Event: scriptFailedToParse(ScriptFailedToParseEventArgs)
            // Event: breakpointResolved(BreakpointResolvedEventArgs)
            // Event: paused(PausedEventArgs)
            // Event: resumed()
            // Event: didSampleProbe(DidSampleProbeEventArgs)
            // Event: playBreakpointActionSound(PlayBreakpointActionSoundEventArgs)
        }
        
        type BreakpointId = string; // Breakpoint identifier.
        
        type BreakpointActionIdentifier = number; // Breakpoint action identifier.
        
        type ScriptId = string; // Unique script identifier.
        
        type CallFrameId = string; // Call frame identifier.
        
        // Location in the source code.
        interface Location {
            scriptId: ScriptId; // Script identifier as reported in the <code>Debugger.scriptParsed</code>.
            lineNumber: number; // Line number in the script.
            columnNumber?: number; // Column number in the script.
        }
        
        // Action to perform when a breakpoint is triggered.
        interface BreakpointAction {
            type: string; // Different kinds of breakpoint actions.
            data?: string; // Data associated with this breakpoint type (e.g. for type "eval" this is the JavaScript string to evalulate).
            id?: BreakpointActionIdentifier; // A frontend-assigned identifier for this breakpoint action.
        }
        
        // Extra options that modify breakpoint behavior.
        interface BreakpointOptions {
            condition?: string; // Expression to use as a breakpoint condition. When specified, debugger will only stop on the breakpoint if this expression evaluates to true.
            actions?: BreakpointAction[]; // Actions to perform automatically when the breakpoint is triggered.
            autoContinue?: boolean; // Automatically continue after hitting this breakpoint and running actions.
            ignoreCount?: number; // Number of times to ignore this breakpoint, before stopping on the breakpoint and running actions.
        }
        
        // Information about the function.
        interface FunctionDetails {
            location: Location; // Location of the function.
            name?: string; // Name of the function. Not present for anonymous functions.
            displayName?: string; // Display name of the function(specified in 'displayName' property on the function object).
            inferredName?: string; // Name of the function inferred from its initial assignment.
            scopeChain?: Scope[]; // Scope chain for this closure.
        }
        
        // JavaScript call frame. Array of call frames form the call stack.
        interface CallFrame {
            callFrameId: CallFrameId; // Call frame identifier. This identifier is only valid while the virtual machine is paused.
            functionName: string; // Name of the JavaScript function called on this call frame.
            location: Location; // Location in the source code.
            scopeChain: Scope[]; // Scope chain for this call frame.
            this: Runtime.RemoteObject; // <code>this</code> object for this call frame.
        }
        
        // Scope description.
        interface Scope {
            type: string; // Scope type.
            object: Runtime.RemoteObject; // Object representing the scope. For <code>global</code> and <code>with</code> scopes it represents the actual object; for the rest of the scopes, it is artificial transient object enumerating scope variables as its properties.
        }
        
        // A sample collected by evaluating a probe breakpoint action.
        interface ProbeSample {
            probeId: BreakpointActionIdentifier; // Identifier of the probe breakpoint action that created the sample.
            sampleId: number; // Unique identifier for this sample.
            batchId: number; // A batch identifier which is the same for all samples taken at the same breakpoint hit.
            timestamp: number; // Timestamp of when the sample was taken.
            payload: Runtime.RemoteObject; // Contents of the sample.
        }
        
        // The pause reason auxiliary data when paused because of an assertion.
        interface AssertPauseReason {
            message?: string; // The console.assert message string if provided.
        }
        
        // The pause reason auxiliary data when paused because of hitting a breakpoint.
        interface BreakpointPauseReason {
            breakpointId: string; // The identifier of the breakpoint causing the pause.
        }
        
        // The pause reason auxiliary data when paused because of a Content Security Policy directive.
        interface CSPViolationPauseReason {
            directive: string; // The CSP directive that blocked script execution.
        }
        
        // Parameters passed to the 'setBreakpointsActive' method
        interface SetBreakpointsActiveParams {
            active: boolean; // New value for breakpoints active state.
        }
        
        // The result from setBreakpointByUrl method
        interface SetBreakpointByUrlResult {
            breakpointId: BreakpointId; // Id of the created breakpoint for further reference.
            locations: Location[]; // List of the locations this breakpoint resolved into upon addition.
        }
        
        // Parameters passed to the 'setBreakpointByUrl' method
        interface SetBreakpointByUrlParams {
            lineNumber: number; // Line number to set breakpoint at.
            url?: string; // URL of the resources to set breakpoint on.
            urlRegex?: string; // Regex pattern for the URLs of the resources to set breakpoints on. Either <code>url</code> or <code>urlRegex</code> must be specified.
            columnNumber?: number; // Offset in the line to set breakpoint at.
            options?: BreakpointOptions; // Options to apply to this breakpoint to modify its behavior.
        }
        
        // The result from setBreakpoint method
        interface SetBreakpointResult {
            breakpointId: BreakpointId; // Id of the created breakpoint for further reference.
            actualLocation: Location; // Location this breakpoint resolved into.
        }
        
        // Parameters passed to the 'setBreakpoint' method
        interface SetBreakpointParams {
            location: Location; // Location to set breakpoint in.
            options?: BreakpointOptions; // Options to apply to this breakpoint to modify its behavior.
        }
        
        // Parameters passed to the 'removeBreakpoint' method
        interface RemoveBreakpointParams {
            breakpointId: BreakpointId; // 
        }
        
        // Parameters passed to the 'continueToLocation' method
        interface ContinueToLocationParams {
            location: Location; // Location to continue to.
        }
        
        // The result from searchInContent method
        interface SearchInContentResult {
            result: GenericTypes.SearchMatch[]; // List of search matches.
        }
        
        // Parameters passed to the 'searchInContent' method
        interface SearchInContentParams {
            scriptId: ScriptId; // Id of the script to search in.
            query: string; // String to search for.
            caseSensitive?: boolean; // If true, search is case sensitive.
            isRegex?: boolean; // If true, treats string parameter as regex.
        }
        
        // The result from getScriptSource method
        interface GetScriptSourceResult {
            scriptSource: string; // Script source.
        }
        
        // Parameters passed to the 'getScriptSource' method
        interface GetScriptSourceParams {
            scriptId: ScriptId; // Id of the script to get source for.
        }
        
        // The result from getFunctionDetails method
        interface GetFunctionDetailsResult {
            details: FunctionDetails; // Information about the function.
        }
        
        // Parameters passed to the 'getFunctionDetails' method
        interface GetFunctionDetailsParams {
            functionId: Runtime.RemoteObjectId; // Id of the function to get location for.
        }
        
        // Parameters passed to the 'setPauseOnExceptions' method
        interface SetPauseOnExceptionsParams {
            state: string; // Pause on exceptions mode.
        }
        
        // The result from evaluateOnCallFrame method
        interface EvaluateOnCallFrameResult {
            result: Runtime.RemoteObject; // Object wrapper for the evaluation result.
            wasThrown?: boolean; // True if the result was thrown during the evaluation.
            savedResultIndex?: number; // If the result was saved, this is the $n index that can be used to access the value.
        }
        
        // Parameters passed to the 'evaluateOnCallFrame' method
        interface EvaluateOnCallFrameParams {
            callFrameId: CallFrameId; // Call frame identifier to evaluate on.
            expression: string; // Expression to evaluate.
            objectGroup?: string; // String object group name to put result into (allows rapid releasing resulting object handles using <code>releaseObjectGroup</code>).
            includeCommandLineAPI?: boolean; // Specifies whether command line API should be available to the evaluated expression, defaults to false.
            doNotPauseOnExceptionsAndMuteConsole?: boolean; // Specifies whether evaluation should stop on exceptions and mute console. Overrides setPauseOnException state.
            returnByValue?: boolean; // Whether the result is expected to be a JSON object that should be sent by value.
            generatePreview?: boolean; // Whether preview should be generated for the result.
            saveResult?: boolean; // Whether the resulting value should be considered for saving in the $n history.
        }
        
        // Parameters passed to the 'setOverlayMessage' method
        interface SetOverlayMessageParams {
            message?: string; // Overlay message to display when paused in debugger.
        }
        
        // Parameters passed to the 'scriptParsed' method
        interface ScriptParsedEventArgs {
            scriptId: ScriptId; // Identifier of the script parsed.
            url: string; // URL or name of the script parsed (if any).
            startLine: number; // Line offset of the script within the resource with given URL (for script tags).
            startColumn: number; // Column offset of the script within the resource with given URL.
            endLine: number; // Last line of the script.
            endColumn: number; // Length of the last line of the script.
            isContentScript?: boolean; // Determines whether this script is a user extension script.
            sourceMapURL?: string; // URL of source map associated with script (if any).
            hasSourceURL?: boolean; // True, if this script has sourceURL.
        }
        
        // Parameters passed to the 'scriptFailedToParse' method
        interface ScriptFailedToParseEventArgs {
            url: string; // URL of the script that failed to parse.
            scriptSource: string; // Source text of the script that failed to parse.
            startLine: number; // Line offset of the script within the resource.
            errorLine: number; // Line with error.
            errorMessage: string; // Parse error message.
        }
        
        // Parameters passed to the 'breakpointResolved' method
        interface BreakpointResolvedEventArgs {
            breakpointId: BreakpointId; // Breakpoint unique identifier.
            location: Location; // Actual breakpoint location.
        }
        
        // Parameters passed to the 'paused' method
        interface PausedEventArgs {
            callFrames: CallFrame[]; // Call stack the virtual machine stopped on.
            reason: string; // Pause reason.
            data?: any; // Object containing break-specific auxiliary properties.
        }
        
        // Parameters passed to the 'didSampleProbe' method
        interface DidSampleProbeEventArgs {
            sample: ProbeSample; // A collected probe sample.
        }
        
        // Parameters passed to the 'playBreakpointActionSound' method
        interface PlayBreakpointActionSoundEventArgs {
            breakpointActionId: BreakpointActionIdentifier; // Breakpoint action identifier.
        }
    }
    
    // Exposes generic types to be used by any domain.
    namespace GenericTypes {
        
        // GenericTypes
        interface GenericTypes {
        }
        
        // Search match in a resource.
        interface SearchMatch {
            lineNumber: number; // Line number in resource content.
            lineContent: string; // Line with match content.
        }
    }
    
    // Heap domain exposes JavaScript heap attributes and capabilities.
    namespace Heap {
        
        // Heap
        interface Heap {
            enable?(): Promise<Webkit.Response<any>>; // // Enables Heap domain events.
            disable?(): Promise<Webkit.Response<any>>; // // Disables Heap domain events.
            gc?(): Promise<Webkit.Response<any>>; // // Trigger a full garbage collection.
            // Event: garbageCollected(GarbageCollectedEventArgs)
        }
        
        // Information about a garbage collection.
        interface GarbageCollection {
            type: string; // The type of garbage collection.
            startTime: number; // 
            endTime: number; // 
        }
        
        // Parameters passed to the 'garbageCollected' method
        interface GarbageCollectedEventArgs {
            collection: GarbageCollection; // 
        }
    }
    
    namespace IndexedDB {
        
        // IndexedDB
        interface IndexedDB {
            enable?(): Promise<Webkit.Response<any>>; // // Enables events from backend.
            disable?(): Promise<Webkit.Response<any>>; // // Disables events from backend.
            requestDatabaseNames?(args: RequestDatabaseNamesParams ): Promise<Webkit.Response<RequestDatabaseNamesResult>>; // // Requests database names for given security origin.
            requestDatabase?(args: RequestDatabaseParams ): Promise<Webkit.Response<RequestDatabaseResult>>; // // Requests database with given name in given frame.
            requestData?(args: RequestDataParams ): Promise<Webkit.Response<RequestDataResult>>; // // Requests data from object store or index.
            clearObjectStore?(args: ClearObjectStoreParams ): Promise<Webkit.Response<ClearObjectStoreResult>>; // // Clears all entries from an object store.
        }
        
        // Database with an array of object stores.
        interface DatabaseWithObjectStores {
            name: string; // Database name.
            version: number; // Database version.
            objectStores: ObjectStore[]; // Object stores in this database.
        }
        
        // Object store.
        interface ObjectStore {
            name: string; // Object store name.
            keyPath: KeyPath; // Object store key path.
            autoIncrement: boolean; // If true, object store has auto increment flag set.
            indexes: ObjectStoreIndex[]; // Indexes in this object store.
        }
        
        // Object store index.
        interface ObjectStoreIndex {
            name: string; // Index name.
            keyPath: KeyPath; // Index key path.
            unique: boolean; // If true, index is unique.
            multiEntry: boolean; // If true, index allows multiple entries for a key.
        }
        
        // Key.
        interface Key {
            type: string; // Key type.
            number?: number; // Number value.
            string?: string; // String value.
            date?: number; // Date value.
            array?: Key[]; // Array value.
        }
        
        // Key range.
        interface KeyRange {
            lower?: Key; // Lower bound.
            upper?: Key; // Upper bound.
            lowerOpen: boolean; // If true lower bound is open.
            upperOpen: boolean; // If true upper bound is open.
        }
        
        // Data entry.
        interface DataEntry {
            key: Runtime.RemoteObject; // Key.
            primaryKey: Runtime.RemoteObject; // Primary key.
            value: Runtime.RemoteObject; // Value.
        }
        
        // Key path.
        interface KeyPath {
            type: string; // Key path type.
            string?: string; // String value.
            array?: string[]; // Array value.
        }
        
        // The result from requestDatabaseNames method
        interface RequestDatabaseNamesResult {
            databaseNames: string[]; // Database names for origin.
        }
        
        // Parameters passed to the 'requestDatabaseNames' method
        interface RequestDatabaseNamesParams {
            securityOrigin: string; // Security origin.
        }
        
        // The result from requestDatabase method
        interface RequestDatabaseResult {
            databaseWithObjectStores: DatabaseWithObjectStores; // Database with an array of object stores.
        }
        
        // Parameters passed to the 'requestDatabase' method
        interface RequestDatabaseParams {
            securityOrigin: string; // Security origin.
            databaseName: string; // Database name.
        }
        
        // The result from requestData method
        interface RequestDataResult {
            objectStoreDataEntries: DataEntry[]; // Array of object store data entries.
            hasMore: boolean; // If true, there are more entries to fetch in the given range.
        }
        
        // Parameters passed to the 'requestData' method
        interface RequestDataParams {
            securityOrigin: string; // Security origin.
            databaseName: string; // Database name.
            objectStoreName: string; // Object store name.
            indexName: string; // Index name, empty string for object store data requests.
            skipCount: number; // Number of records to skip.
            pageSize: number; // Number of records to fetch.
            keyRange?: KeyRange; // Key range.
        }
        
        // The result from clearObjectStore method
        interface ClearObjectStoreResult {
        }
        
        // Parameters passed to the 'clearObjectStore' method
        interface ClearObjectStoreParams {
            securityOrigin: string; // Security origin.
            databaseName: string; // Database name.
            objectStoreName: string; // Object store name.
        }
    }
    
    namespace Inspector {
        
        // Inspector
        interface Inspector {
            enable?(): Promise<Webkit.Response<any>>; // // Enables inspector domain notifications.
            disable?(): Promise<Webkit.Response<any>>; // // Disables inspector domain notifications.
            initialized?(): Promise<Webkit.Response<any>>; // // Sent by the frontend after all initialization messages have been sent.
            // Event: evaluateForTestInFrontend(EvaluateForTestInFrontendEventArgs)
            // Event: inspect(InspectEventArgs)
            // Event: detached(DetachedEventArgs)
            // Event: activateExtraDomains(ActivateExtraDomainsEventArgs)
            // Event: targetCrashed()
        }
        
        // Parameters passed to the 'evaluateForTestInFrontend' method
        interface EvaluateForTestInFrontendEventArgs {
            script: string; // 
        }
        
        // Parameters passed to the 'inspect' method
        interface InspectEventArgs {
            object: Runtime.RemoteObject; // 
            hints: any; // 
        }
        
        // Parameters passed to the 'detached' method
        interface DetachedEventArgs {
            reason: string; // The reason why connection has been terminated.
        }
        
        // Parameters passed to the 'activateExtraDomains' method
        interface ActivateExtraDomainsEventArgs {
            domains: string[]; // Domain names that need activation
        }
    }
    
    namespace LayerTree {
        
        // LayerTree
        interface LayerTree {
            enable?(): Promise<Webkit.Response<any>>; // // Enables compositing tree inspection.
            disable?(): Promise<Webkit.Response<any>>; // // Disables compositing tree inspection.
            layersForNode?(args: LayersForNodeParams ): Promise<Webkit.Response<LayersForNodeResult>>; // // Returns the layer tree structure of the current page.
            reasonsForCompositingLayer?(args: ReasonsForCompositingLayerParams ): Promise<Webkit.Response<ReasonsForCompositingLayerResult>>; // // Provides the reasons why the given layer was composited.
            // Event: layerTreeDidChange()
        }
        
        type LayerId = string; // Unique RenderLayer identifier.
        
        type PseudoElementId = string; // Unique PseudoElement identifier.
        
        // A rectangle.
        interface IntRect {
            x: number; // The x position.
            y: number; // The y position.
            width: number; // The width metric.
            height: number; // The height metric.
        }
        
        // Information about a compositing layer.
        interface Layer {
            layerId: LayerId; // The unique id for this layer.
            nodeId: DOM.NodeId; // The id for the node associated with this layer.
            bounds: IntRect; // Bounds of the layer in absolute page coordinates.
            paintCount: number; // Indicates how many time this layer has painted.
            memory: number; // Estimated memory used by this layer.
            compositedBounds: IntRect; // The bounds of the composited layer.
            isInShadowTree?: boolean; // Indicates whether this layer is associated with an element hosted in a shadow tree.
            isReflection?: boolean; // Indicates whether this layer was used to provide a reflection for the element.
            isGeneratedContent?: boolean; // Indicates whether the layer is attached to a pseudo element that is CSS generated content.
            isAnonymous?: boolean; // Indicates whether the layer was created for a CSS anonymous block or box.
            pseudoElementId?: PseudoElementId; // The id for the pseudo element associated with this layer.
            pseudoElement?: string; // The name of the CSS pseudo-element that prompted the layer to be generated.
        }
        
        // An object containing the reasons why the layer was composited as properties.
        interface CompositingReasons {
            transform3D?: boolean; // Composition due to association with an element with a CSS 3D transform.
            video?: boolean; // Composition due to association with a <video> element.
            canvas?: boolean; // Composition due to the element being a <canvas> element.
            plugin?: boolean; // Composition due to association with a plugin.
            iFrame?: boolean; // Composition due to association with an <iframe> element.
            backfaceVisibilityHidden?: boolean; // Composition due to association with an element with a "backface-visibility: hidden" style.
            clipsCompositingDescendants?: boolean; // Composition due to association with an element clipping compositing descendants.
            animation?: boolean; // Composition due to association with an animated element.
            filters?: boolean; // Composition due to association with an element with CSS filters applied.
            positionFixed?: boolean; // Composition due to association with an element with a "position: fixed" style.
            positionSticky?: boolean; // Composition due to association with an element with a "position: sticky" style.
            overflowScrollingTouch?: boolean; // Composition due to association with an element with a "overflow-scrolling: touch" style.
            stacking?: boolean; // Composition due to association with an element establishing a stacking context.
            overlap?: boolean; // Composition due to association with an element overlapping other composited elements.
            negativeZIndexChildren?: boolean; // Composition due to association with an element with descendants that have a negative z-index.
            transformWithCompositedDescendants?: boolean; // Composition due to association with an element with composited descendants.
            opacityWithCompositedDescendants?: boolean; // Composition due to association with an element with opacity applied and composited descendants.
            maskWithCompositedDescendants?: boolean; // Composition due to association with a masked element and composited descendants.
            reflectionWithCompositedDescendants?: boolean; // Composition due to association with an element with a reflection and composited descendants.
            filterWithCompositedDescendants?: boolean; // Composition due to association with an element with CSS filters applied and composited descendants.
            blendingWithCompositedDescendants?: boolean; // Composition due to association with an element with CSS blending applied and composited descendants.
            isolatesCompositedBlendingDescendants?: boolean; // Composition due to association with an element isolating compositing descendants having CSS blending applied.
            perspective?: boolean; // Composition due to association with an element with perspective applied.
            preserve3D?: boolean; // Composition due to association with an element with a "transform-style: preserve-3d" style.
            willChange?: boolean; // Composition due to association with an element with a "will-change" style.
            root?: boolean; // Composition due to association with the root element.
            blending?: boolean; // Composition due to association with an element with a "blend-mode" style.
        }
        
        // The result from layersForNode method
        interface LayersForNodeResult {
            layers: Layer[]; // Child layers.
        }
        
        // Parameters passed to the 'layersForNode' method
        interface LayersForNodeParams {
            nodeId: DOM.NodeId; // Root of the subtree for which we want to gather layers.
        }
        
        // The result from reasonsForCompositingLayer method
        interface ReasonsForCompositingLayerResult {
            compositingReasons: CompositingReasons; // An object containing the reasons why the layer was composited as properties.
        }
        
        // Parameters passed to the 'reasonsForCompositingLayer' method
        interface ReasonsForCompositingLayerParams {
            layerId: LayerId; // The id of the layer for which we want to get the reasons it was composited.
        }
    }
    
    // Network domain allows tracking network activities of the page. It exposes information about http, file, data and other requests and responses, their headers, bodies, timing, etc.
    namespace Network {
        
        // Network
        interface Network {
            enable?(): Promise<Webkit.Response<any>>; // // Enables network tracking, network events will now be delivered to the client.
            disable?(): Promise<Webkit.Response<any>>; // // Disables network tracking, prevents network events from being sent to the client.
            setExtraHTTPHeaders?(args: SetExtraHTTPHeadersParams ): Promise<Webkit.Response<any>>; // // Specifies whether to always send extra HTTP headers with the requests from this page.
            getResponseBody?(args: GetResponseBodyParams ): Promise<Webkit.Response<GetResponseBodyResult>>; // // Returns content served for the given request.
            setCacheDisabled?(args: SetCacheDisabledParams ): Promise<Webkit.Response<any>>; // // Toggles ignoring cache for each request. If <code>true</code>, cache will not be used.
            loadResource?(args: LoadResourceParams ): Promise<Webkit.Response<LoadResourceResult>>; // // Loads a resource in the context of a frame on the inspected page without cross origin checks.
            // Event: requestWillBeSent(RequestWillBeSentEventArgs)
            // Event: requestServedFromCache(RequestServedFromCacheEventArgs)
            // Event: responseReceived(ResponseReceivedEventArgs)
            // Event: dataReceived(DataReceivedEventArgs)
            // Event: loadingFinished(LoadingFinishedEventArgs)
            // Event: loadingFailed(LoadingFailedEventArgs)
            // Event: requestServedFromMemoryCache(RequestServedFromMemoryCacheEventArgs)
            // Event: webSocketWillSendHandshakeRequest(WebSocketWillSendHandshakeRequestEventArgs)
            // Event: webSocketHandshakeResponseReceived(WebSocketHandshakeResponseReceivedEventArgs)
            // Event: webSocketCreated(WebSocketCreatedEventArgs)
            // Event: webSocketClosed(WebSocketClosedEventArgs)
            // Event: webSocketFrameReceived(WebSocketFrameReceivedEventArgs)
            // Event: webSocketFrameError(WebSocketFrameErrorEventArgs)
            // Event: webSocketFrameSent(WebSocketFrameSentEventArgs)
        }
        
        type LoaderId = string; // Unique loader identifier.
        
        type FrameId = string; // Unique frame identifier.
        
        type RequestId = string; // Unique request identifier.
        
        type Timestamp = number; // Number of seconds since epoch.
        
        // Request / response headers as keys / values of JSON object.
        interface Headers {
        }
        
        // Timing information for the request.
        interface ResourceTiming {
            navigationStart: number; // Timing's navigationStart is a baseline in seconds, while the other numbers are ticks in milliseconds relatively to this navigationStart.
            domainLookupStart: number; // Started DNS address resolve.
            domainLookupEnd: number; // Finished DNS address resolve.
            connectStart: number; // Started connecting to the remote host.
            connectEnd: number; // Connected to the remote host.
            secureConnectionStart: number; // Started SSL handshake.
            requestStart: number; // Started sending request.
            responseStart: number; // Started receiving response headers.
        }
        
        // HTTP request data.
        interface Request {
            url: string; // Request URL.
            method: string; // HTTP request method.
            headers: Headers; // HTTP request headers.
            postData?: string; // HTTP POST request data.
        }
        
        // HTTP response data.
        interface Response {
            url: string; // Response URL. This URL can be different from CachedResource.url in case of redirect.
            status: number; // HTTP response status code.
            statusText: string; // HTTP response status text.
            headers: Headers; // HTTP response headers.
            headersText?: string; // HTTP response headers text.
            mimeType: string; // Resource mimeType as determined by the browser.
            requestHeaders?: Headers; // Refined HTTP request headers that were actually transmitted over the network.
            requestHeadersText?: string; // HTTP request headers text.
            fromDiskCache?: boolean; // Specifies that the request was served from the disk cache.
            timing?: ResourceTiming; // Timing information for the given request.
        }
        
        // WebSocket request data.
        interface WebSocketRequest {
            headers: Headers; // HTTP response headers.
        }
        
        // WebSocket response data.
        interface WebSocketResponse {
            status: number; // HTTP response status code.
            statusText: string; // HTTP response status text.
            headers: Headers; // HTTP response headers.
        }
        
        // WebSocket frame data.
        interface WebSocketFrame {
            opcode: number; // WebSocket frame opcode.
            mask: boolean; // WebSocket frame mask.
            payloadData: string; // WebSocket frame payload data.
        }
        
        // Information about the cached resource.
        interface CachedResource {
            url: string; // Resource URL. This is the url of the original network request.
            type: Page.ResourceType; // Type of this resource.
            response?: Response; // Cached response data.
            bodySize: number; // Cached response body size.
            sourceMapURL?: string; // URL of source map associated with this resource (if any).
        }
        
        // Information about the request initiator.
        interface Initiator {
            type: string; // Type of this initiator.
            stackTrace?: Console.StackTrace; // Initiator JavaScript stack trace, set for Script only.
            url?: string; // Initiator URL, set for Parser type only.
            lineNumber?: number; // Initiator line number, set for Parser type only.
        }
        
        // Parameters passed to the 'setExtraHTTPHeaders' method
        interface SetExtraHTTPHeadersParams {
            headers: Headers; // Map with extra HTTP headers.
        }
        
        // The result from getResponseBody method
        interface GetResponseBodyResult {
            body: string; // Response body.
            base64Encoded: boolean; // True, if content was sent as base64.
        }
        
        // Parameters passed to the 'getResponseBody' method
        interface GetResponseBodyParams {
            requestId: RequestId; // Identifier of the network request to get content for.
        }
        
        // Parameters passed to the 'setCacheDisabled' method
        interface SetCacheDisabledParams {
            cacheDisabled: boolean; // Cache disabled state.
        }
        
        // The result from loadResource method
        interface LoadResourceResult {
            content: string; // Resource content.
            mimeType: string; // Resource mimeType.
            status: number; // HTTP response status code.
        }
        
        // Parameters passed to the 'loadResource' method
        interface LoadResourceParams {
            frameId: FrameId; // Frame to load the resource from.
            url: string; // URL of the resource to load.
        }
        
        // Parameters passed to the 'requestWillBeSent' method
        interface RequestWillBeSentEventArgs {
            requestId: RequestId; // Request identifier.
            frameId: FrameId; // Frame identifier.
            loaderId: LoaderId; // Loader identifier.
            documentURL: string; // URL of the document this request is loaded for.
            request: Request; // Request data.
            timestamp: Timestamp; // Timestamp.
            initiator: Initiator; // Request initiator.
            redirectResponse?: Response; // Redirect response data.
            type?: Page.ResourceType; // Resource type.
        }
        
        // Parameters passed to the 'requestServedFromCache' method
        interface RequestServedFromCacheEventArgs {
            requestId: RequestId; // Request identifier.
        }
        
        // Parameters passed to the 'responseReceived' method
        interface ResponseReceivedEventArgs {
            requestId: RequestId; // Request identifier.
            frameId: FrameId; // Frame identifier.
            loaderId: LoaderId; // Loader identifier.
            timestamp: Timestamp; // Timestamp.
            type: Page.ResourceType; // Resource type.
            response: Response; // Response data.
        }
        
        // Parameters passed to the 'dataReceived' method
        interface DataReceivedEventArgs {
            requestId: RequestId; // Request identifier.
            timestamp: Timestamp; // Timestamp.
            dataLength: number; // Data chunk length.
            encodedDataLength: number; // Actual bytes received (might be less than dataLength for compressed encodings).
        }
        
        // Parameters passed to the 'loadingFinished' method
        interface LoadingFinishedEventArgs {
            requestId: RequestId; // Request identifier.
            timestamp: Timestamp; // Timestamp.
            sourceMapURL?: string; // URL of source map associated with this resource (if any).
        }
        
        // Parameters passed to the 'loadingFailed' method
        interface LoadingFailedEventArgs {
            requestId: RequestId; // Request identifier.
            timestamp: Timestamp; // Timestamp.
            errorText: string; // User friendly error message.
            canceled?: boolean; // True if loading was canceled.
        }
        
        // Parameters passed to the 'requestServedFromMemoryCache' method
        interface RequestServedFromMemoryCacheEventArgs {
            requestId: RequestId; // Request identifier.
            frameId: FrameId; // Frame identifier.
            loaderId: LoaderId; // Loader identifier.
            documentURL: string; // URL of the document this request is loaded for.
            timestamp: Timestamp; // Timestamp.
            initiator: Initiator; // Request initiator.
            resource: CachedResource; // Cached resource data.
        }
        
        // Parameters passed to the 'webSocketWillSendHandshakeRequest' method
        interface WebSocketWillSendHandshakeRequestEventArgs {
            requestId: RequestId; // Request identifier.
            timestamp: Timestamp; // Timestamp.
            request: WebSocketRequest; // WebSocket request data.
        }
        
        // Parameters passed to the 'webSocketHandshakeResponseReceived' method
        interface WebSocketHandshakeResponseReceivedEventArgs {
            requestId: RequestId; // Request identifier.
            timestamp: Timestamp; // Timestamp.
            response: WebSocketResponse; // WebSocket response data.
        }
        
        // Parameters passed to the 'webSocketCreated' method
        interface WebSocketCreatedEventArgs {
            requestId: RequestId; // Request identifier.
            url: string; // WebSocket request URL.
        }
        
        // Parameters passed to the 'webSocketClosed' method
        interface WebSocketClosedEventArgs {
            requestId: RequestId; // Request identifier.
            timestamp: Timestamp; // Timestamp.
        }
        
        // Parameters passed to the 'webSocketFrameReceived' method
        interface WebSocketFrameReceivedEventArgs {
            requestId: RequestId; // Request identifier.
            timestamp: Timestamp; // Timestamp.
            response: WebSocketFrame; // WebSocket response data.
        }
        
        // Parameters passed to the 'webSocketFrameError' method
        interface WebSocketFrameErrorEventArgs {
            requestId: RequestId; // Request identifier.
            timestamp: Timestamp; // Timestamp.
            errorMessage: string; // WebSocket frame error message.
        }
        
        // Parameters passed to the 'webSocketFrameSent' method
        interface WebSocketFrameSentEventArgs {
            requestId: RequestId; // Request identifier.
            timestamp: Timestamp; // Timestamp.
            response: WebSocketFrame; // WebSocket response data.
        }
    }
    
    // Exposes types to be used by the inspector overlay.
    namespace OverlayTypes {
        
        // OverlayTypes
        interface OverlayTypes {
        }
        
        interface Point {
            x: number; // 
            y: number; // 
        }
        
        interface Size {
            width: number; // 
            height: number; // 
        }
        
        type Quad = Point[]; // A quad is a collection of 4 points. When initialized from a rect, the points are in clockwise order from top left.
        
        // A rectangle specified by a reference coordinate and width/height offsets.
        interface Rect {
            x: number; // 
            y: number; // 
            width: number; // 
            height: number; // 
        }
        
        // A single region in a flow thread.
        interface Region {
            borderQuad: Quad; // 
            incomingQuad: Quad; // 
            outgoingQuad: Quad; // 
            isHighlighted?: boolean; // 
        }
        
        type DisplayPath = any[]; // A vector path described using SVG path syntax.
        
        interface RegionFlowData {
            regions: Region[]; // 
            name: string; // 
        }
        
        interface ContentFlowData {
            name: string; // 
        }
        
        interface ShapeOutsideData {
            bounds: Quad; // Bounds for the shape-outside paths.
            shape?: DisplayPath; // Path for the element's shape.
            marginShape?: DisplayPath; // Path for the element's margin shape.
        }
        
        // Data that describes an element to be highlighted.
        interface ElementData {
            tagName: string; // 
            idValue: string; // The value of the element's 'id' attribute.
            className?: string; // 
            size?: Size; // 
            role?: string; // Computed accessibility role for the element.
            regionFlowData?: RegionFlowData; // 
            contentFlowData?: ContentFlowData; // 
            shapeOutsideData?: ShapeOutsideData; // 
        }
        
        // Data required to highlight multiple quads.
        interface FragmentHighlightData {
            quads: Quad[]; // Quads for which the highlight should be applied.
            contentColor: string; // 
            contentOutlineColor: string; // 
            paddingColor: string; // 
            borderColor: string; // 
            marginColor: string; // 
            regionClippingArea?: Quad; // 
        }
        
        // Data required to highlight a DOM node.
        interface NodeHighlightData {
            scrollOffset: Point; // Scroll offset for the MainFrame's FrameView that is shared across all quads.
            fragments: FragmentHighlightData[]; // 
            elementData?: ElementData; // 
        }
        
        // Data required to configure the overlay's size and scaling behavior.
        interface OverlayConfiguration {
            deviceScaleFactor: number; // 
            viewportSize: Size; // 
            frameViewFullSize: Size; // 
        }
    }
    
    // Actions and events related to the inspected page belong to the page domain.
    namespace Page {
        
        // Page
        interface Page {
            enable?(): Promise<Webkit.Response<any>>; // // Enables page domain notifications.
            disable?(): Promise<Webkit.Response<any>>; // // Disables page domain notifications.
            addScriptToEvaluateOnLoad?(args: AddScriptToEvaluateOnLoadParams ): Promise<Webkit.Response<AddScriptToEvaluateOnLoadResult>>; // 
            removeScriptToEvaluateOnLoad?(args: RemoveScriptToEvaluateOnLoadParams ): Promise<Webkit.Response<any>>; // 
            reload?(args: ReloadParams ): Promise<Webkit.Response<any>>; // // Reloads given page optionally ignoring the cache.
            navigate?(args: NavigateParams ): Promise<Webkit.Response<any>>; // // Navigates current page to the given URL.
            getCookies?(): Promise<Webkit.Response<GetCookiesResult>>; // // Returns all browser cookies. Depending on the backend support, will return detailed cookie information in the <code>cookies</code> field.
            deleteCookie?(args: DeleteCookieParams ): Promise<Webkit.Response<any>>; // // Deletes browser cookie with given name, domain and path.
            getResourceTree?(): Promise<Webkit.Response<GetResourceTreeResult>>; // // Returns present frame / resource tree structure.
            getResourceContent?(args: GetResourceContentParams ): Promise<Webkit.Response<GetResourceContentResult>>; // // Returns content of the given resource.
            searchInResource?(args: SearchInResourceParams ): Promise<Webkit.Response<SearchInResourceResult>>; // // Searches for given string in resource content.
            searchInResources?(args: SearchInResourcesParams ): Promise<Webkit.Response<SearchInResourcesResult>>; // // Searches for given string in frame / resource tree structure.
            setDocumentContent?(args: SetDocumentContentParams ): Promise<Webkit.Response<any>>; // // Sets given markup as the document's HTML.
            setShowPaintRects?(args: SetShowPaintRectsParams ): Promise<Webkit.Response<any>>; // // Requests that backend shows paint rectangles
            getScriptExecutionStatus?(): Promise<Webkit.Response<GetScriptExecutionStatusResult>>; // // Determines if scripts can be executed in the page.
            setScriptExecutionDisabled?(args: SetScriptExecutionDisabledParams ): Promise<Webkit.Response<any>>; // // Switches script execution in the page.
            setTouchEmulationEnabled?(args: SetTouchEmulationEnabledParams ): Promise<Webkit.Response<any>>; // // Toggles mouse event-based touch event emulation.
            setEmulatedMedia?(args: SetEmulatedMediaParams ): Promise<Webkit.Response<any>>; // // Emulates the given media for CSS media queries.
            getCompositingBordersVisible?(): Promise<Webkit.Response<GetCompositingBordersVisibleResult>>; // // Indicates the visibility of compositing borders.
            setCompositingBordersVisible?(args: SetCompositingBordersVisibleParams ): Promise<Webkit.Response<any>>; // // Controls the visibility of compositing borders.
            snapshotNode?(args: SnapshotNodeParams ): Promise<Webkit.Response<SnapshotNodeResult>>; // // Capture a snapshot of the specified node that does not include unrelated layers.
            snapshotRect?(args: SnapshotRectParams ): Promise<Webkit.Response<SnapshotRectResult>>; // // Capture a snapshot of the page within the specified rectangle and coordinate system.
            handleJavaScriptDialog?(args: HandleJavaScriptDialogParams ): Promise<Webkit.Response<any>>; // // Accepts or dismisses a JavaScript initiated dialog (alert, confirm, prompt, or onbeforeunload).
            archive?(): Promise<Webkit.Response<ArchiveResult>>; // // Grab an archive of the page.
            // Event: domContentEventFired(DomContentEventFiredEventArgs)
            // Event: loadEventFired(LoadEventFiredEventArgs)
            // Event: frameNavigated(FrameNavigatedEventArgs)
            // Event: frameDetached(FrameDetachedEventArgs)
            // Event: frameStartedLoading(FrameStartedLoadingEventArgs)
            // Event: frameStoppedLoading(FrameStoppedLoadingEventArgs)
            // Event: frameScheduledNavigation(FrameScheduledNavigationEventArgs)
            // Event: frameClearedScheduledNavigation(FrameClearedScheduledNavigationEventArgs)
            // Event: javascriptDialogOpening(JavascriptDialogOpeningEventArgs)
            // Event: javascriptDialogClosed()
            // Event: scriptsEnabled(ScriptsEnabledEventArgs)
        }
        
        type ResourceType = string; // Resource type as it was perceived by the rendering engine.
        
        type CoordinateSystem = string; // Coordinate system used by supplied coordinates.
        
        // Information about the Frame on the page.
        interface Frame {
            id: string; // Frame unique identifier.
            parentId?: string; // Parent frame identifier.
            loaderId: Network.LoaderId; // Identifier of the loader associated with this frame.
            name?: string; // Frame's name as specified in the tag.
            url: string; // Frame document's URL.
            securityOrigin: string; // Frame document's security origin.
            mimeType: string; // Frame document's mimeType as determined by the browser.
        }
        
        interface FrameResource {
            url: string; // Resource URL.
            type: ResourceType; // Type of this resource.
            mimeType: string; // Resource mimeType as determined by the browser.
            failed?: boolean; // True if the resource failed to load.
            canceled?: boolean; // True if the resource was canceled during loading.
            sourceMapURL?: string; // URL of source map associated with this resource (if any).
        }
        
        // Information about the Frame hierarchy along with their cached resources.
        interface FrameResourceTree {
            frame: Frame; // Frame information for this tree item.
            childFrames?: FrameResourceTree[]; // Child frames.
            resources: FrameResource[]; // Information about frame resources.
        }
        
        // Search result for resource.
        interface SearchResult {
            url: string; // Resource URL.
            frameId: Network.FrameId; // Resource frame id.
            matchesCount: number; // Number of matches in the resource content.
        }
        
        // Cookie object
        interface Cookie {
            name: string; // Cookie name.
            value: string; // Cookie value.
            domain: string; // Cookie domain.
            path: string; // Cookie path.
            expires: number; // Cookie expires.
            size: number; // Cookie size.
            httpOnly: boolean; // True if cookie is http-only.
            secure: boolean; // True if cookie is secure.
            session: boolean; // True in case of session cookie.
        }
        
        type ScriptIdentifier = string; // Unique script identifier.
        
        // The result from addScriptToEvaluateOnLoad method
        interface AddScriptToEvaluateOnLoadResult {
            identifier: ScriptIdentifier; // Identifier of the added script.
        }
        
        // Parameters passed to the 'addScriptToEvaluateOnLoad' method
        interface AddScriptToEvaluateOnLoadParams {
            scriptSource: string; // 
        }
        
        // Parameters passed to the 'removeScriptToEvaluateOnLoad' method
        interface RemoveScriptToEvaluateOnLoadParams {
            identifier: ScriptIdentifier; // 
        }
        
        // Parameters passed to the 'reload' method
        interface ReloadParams {
            ignoreCache?: boolean; // If true, browser cache is ignored (as if the user pressed Shift+refresh).
            scriptToEvaluateOnLoad?: string; // If set, the script will be injected into all frames of the inspected page after reload.
        }
        
        // Parameters passed to the 'navigate' method
        interface NavigateParams {
            url: string; // URL to navigate the page to.
        }
        
        // The result from getCookies method
        interface GetCookiesResult {
            cookies: Cookie[]; // Array of cookie objects.
        }
        
        // Parameters passed to the 'deleteCookie' method
        interface DeleteCookieParams {
            cookieName: string; // Name of the cookie to remove.
            url: string; // URL to match cooke domain and path.
        }
        
        // The result from getResourceTree method
        interface GetResourceTreeResult {
            frameTree: FrameResourceTree; // Present frame / resource tree structure.
        }
        
        // The result from getResourceContent method
        interface GetResourceContentResult {
            content: string; // Resource content.
            base64Encoded: boolean; // True, if content was served as base64.
        }
        
        // Parameters passed to the 'getResourceContent' method
        interface GetResourceContentParams {
            frameId: Network.FrameId; // Frame id to get resource for.
            url: string; // URL of the resource to get content for.
        }
        
        // The result from searchInResource method
        interface SearchInResourceResult {
            result: GenericTypes.SearchMatch[]; // List of search matches.
        }
        
        // Parameters passed to the 'searchInResource' method
        interface SearchInResourceParams {
            frameId: Network.FrameId; // Frame id for resource to search in.
            url: string; // URL of the resource to search in.
            query: string; // String to search for.
            caseSensitive?: boolean; // If true, search is case sensitive.
            isRegex?: boolean; // If true, treats string parameter as regex.
        }
        
        // The result from searchInResources method
        interface SearchInResourcesResult {
            result: SearchResult[]; // List of search results.
        }
        
        // Parameters passed to the 'searchInResources' method
        interface SearchInResourcesParams {
            text: string; // String to search for.
            caseSensitive?: boolean; // If true, search is case sensitive.
            isRegex?: boolean; // If true, treats string parameter as regex.
        }
        
        // Parameters passed to the 'setDocumentContent' method
        interface SetDocumentContentParams {
            frameId: Network.FrameId; // Frame id to set HTML for.
            html: string; // HTML content to set.
        }
        
        // Parameters passed to the 'setShowPaintRects' method
        interface SetShowPaintRectsParams {
            result: boolean; // True for showing paint rectangles
        }
        
        // The result from getScriptExecutionStatus method
        interface GetScriptExecutionStatusResult {
            result: string; // Script execution status: "allowed" if scripts can be executed, "disabled" if script execution has been disabled through page settings, "forbidden" if script execution for the given page is not possible for other reasons.
        }
        
        // Parameters passed to the 'setScriptExecutionDisabled' method
        interface SetScriptExecutionDisabledParams {
            value: boolean; // Whether script execution should be disabled in the page.
        }
        
        // Parameters passed to the 'setTouchEmulationEnabled' method
        interface SetTouchEmulationEnabledParams {
            enabled: boolean; // Whether the touch event emulation should be enabled.
        }
        
        // Parameters passed to the 'setEmulatedMedia' method
        interface SetEmulatedMediaParams {
            media: string; // Media type to emulate. Empty string disables the override.
        }
        
        // The result from getCompositingBordersVisible method
        interface GetCompositingBordersVisibleResult {
            result: boolean; // If true, compositing borders are visible.
        }
        
        // Parameters passed to the 'setCompositingBordersVisible' method
        interface SetCompositingBordersVisibleParams {
            visible: boolean; // True for showing compositing borders.
        }
        
        // The result from snapshotNode method
        interface SnapshotNodeResult {
            dataURL: string; // Base64-encoded image data (PNG).
        }
        
        // Parameters passed to the 'snapshotNode' method
        interface SnapshotNodeParams {
            nodeId: DOM.NodeId; // Id of the node to snapshot.
        }
        
        // The result from snapshotRect method
        interface SnapshotRectResult {
            dataURL: string; // Base64-encoded image data (PNG).
        }
        
        // Parameters passed to the 'snapshotRect' method
        interface SnapshotRectParams {
            x: number; // X coordinate
            y: number; // Y coordinate
            width: number; // Rectangle width
            height: number; // Rectangle height
            coordinateSystem: CoordinateSystem; // Indicates the coordinate system of the supplied rectangle.
        }
        
        // Parameters passed to the 'handleJavaScriptDialog' method
        interface HandleJavaScriptDialogParams {
            accept: boolean; // Whether to accept or dismiss the dialog.
            promptText?: string; // The text to enter into the dialog prompt before accepting. Used only if this is a prompt dialog.
        }
        
        // The result from archive method
        interface ArchiveResult {
            data: string; // Base64-encoded web archive.
        }
        
        // Parameters passed to the 'domContentEventFired' method
        interface DomContentEventFiredEventArgs {
            timestamp: number; // 
        }
        
        // Parameters passed to the 'loadEventFired' method
        interface LoadEventFiredEventArgs {
            timestamp: number; // 
        }
        
        // Parameters passed to the 'frameNavigated' method
        interface FrameNavigatedEventArgs {
            frame: Frame; // Frame object.
        }
        
        // Parameters passed to the 'frameDetached' method
        interface FrameDetachedEventArgs {
            frameId: Network.FrameId; // Id of the frame that has been detached.
        }
        
        // Parameters passed to the 'frameStartedLoading' method
        interface FrameStartedLoadingEventArgs {
            frameId: Network.FrameId; // Id of the frame that has started loading.
        }
        
        // Parameters passed to the 'frameStoppedLoading' method
        interface FrameStoppedLoadingEventArgs {
            frameId: Network.FrameId; // Id of the frame that has stopped loading.
        }
        
        // Parameters passed to the 'frameScheduledNavigation' method
        interface FrameScheduledNavigationEventArgs {
            frameId: Network.FrameId; // Id of the frame that has scheduled a navigation.
            delay: number; // Delay (in seconds) until the navigation is scheduled to begin. The navigation is not guaranteed to start.
        }
        
        // Parameters passed to the 'frameClearedScheduledNavigation' method
        interface FrameClearedScheduledNavigationEventArgs {
            frameId: Network.FrameId; // Id of the frame that has cleared its scheduled navigation.
        }
        
        // Parameters passed to the 'javascriptDialogOpening' method
        interface JavascriptDialogOpeningEventArgs {
            message: string; // Message that will be displayed by the dialog.
        }
        
        // Parameters passed to the 'scriptsEnabled' method
        interface ScriptsEnabledEventArgs {
            isEnabled: boolean; // Whether script execution is enabled or disabled on the page.
        }
    }
    
    // Controls web replay, and manages recording sessions and segments.
    namespace Replay {
        
        // Replay
        interface Replay {
            startCapturing?(): Promise<Webkit.Response<any>>; // // Starts capture of a new replay session.
            stopCapturing?(): Promise<Webkit.Response<any>>; // // Stops capture of the currently recording replay session.
            replayToPosition?(args: ReplayToPositionParams ): Promise<Webkit.Response<any>>; // // Seek execution to a specific position within the replay session.
            replayToCompletion?(args: ReplayToCompletionParams ): Promise<Webkit.Response<any>>; // // Replay all session segments completely.
            pausePlayback?(): Promise<Webkit.Response<any>>; // // Pauses playback in the current segment. Can be resumed by using a replay command.
            cancelPlayback?(): Promise<Webkit.Response<any>>; // // Cancels playback of the current segment. Further replaying will start from the beginning of the current segment.
            switchSession?(args: SwitchSessionParams ): Promise<Webkit.Response<any>>; // // Unloads the current replay session and loads the specified session
            insertSessionSegment?(args: InsertSessionSegmentParams ): Promise<Webkit.Response<any>>; // // Splices the specified session segment into the session at the specified index.
            removeSessionSegment?(args: RemoveSessionSegmentParams ): Promise<Webkit.Response<any>>; // // Removes the session segment at the specified position from the session.
            currentReplayState?(): Promise<Webkit.Response<CurrentReplayStateResult>>; // // Returns the identifier, position, session state and segment state of the currently loaded session. This is necessary because the inspector may be closed and reopened in the middle of replay.
            getAvailableSessions?(): Promise<Webkit.Response<GetAvailableSessionsResult>>; // // Returns identifiers of all available sessions.
            getSessionData?(args: GetSessionDataParams ): Promise<Webkit.Response<GetSessionDataResult>>; // // Returns an object for the specified session.
            getSegmentData?(args: GetSegmentDataParams ): Promise<Webkit.Response<GetSegmentDataResult>>; // // Returns an object for the specified session segment.
            // Event: captureStarted()
            // Event: captureStopped()
            // Event: playbackHitPosition(PlaybackHitPositionEventArgs)
            // Event: playbackStarted()
            // Event: playbackPaused(PlaybackPausedEventArgs)
            // Event: playbackFinished()
            // Event: inputSuppressionChanged(InputSuppressionChangedEventArgs)
            // Event: sessionCreated(SessionCreatedEventArgs)
            // Event: sessionModified(SessionModifiedEventArgs)
            // Event: sessionRemoved(SessionRemovedEventArgs)
            // Event: sessionLoaded(SessionLoadedEventArgs)
            // Event: segmentCreated(SegmentCreatedEventArgs)
            // Event: segmentRemoved(SegmentRemovedEventArgs)
            // Event: segmentCompleted(SegmentCompletedEventArgs)
            // Event: segmentLoaded(SegmentLoadedEventArgs)
            // Event: segmentUnloaded()
        }
        
        type SessionIdentifier = number; // Unique replay session identifier.
        
        type SegmentIdentifier = number; // Unique session segment identifier.
        
        type SessionState = string; // State machine's state for the session.
        
        type SegmentState = string; // State machine's state for the session segment.
        
        interface ReplayPosition {
            segmentOffset: number; // Offset for a segment within the currently-loaded replay session.
            inputOffset: number; // Offset for an event loop input within the specified session segment.
        }
        
        interface ReplayInput {
            type: string; // Input type.
            offset: number; // Offset of this input in its respective queue.
            data: any; // Per-input payload.
        }
        
        interface ReplayInputQueue {
            type: string; // Queue type
            inputs: ReplayInput[]; // Inputs belonging to this queue.
        }
        
        // A standalone segment of a replay session that corresponds to a single main frame navigation and execution.
        interface SessionSegment {
            id: SegmentIdentifier; // Unique session segment identifier.
            timestamp: number; // Start time of the segment, in milliseconds since the epoch.
            queues: ReplayInputQueue[]; // 
        }
        
        // An ordered collection of replay session segments.
        interface ReplaySession {
            id: SessionIdentifier; // Unique replay session identifier.
            timestamp: number; // Creation time of session, in milliseconds since the epoch.
            segments: SegmentIdentifier[]; // An ordered list identifiers for the segments that comprise this replay session.
        }
        
        // Parameters passed to the 'replayToPosition' method
        interface ReplayToPositionParams {
            position: ReplayPosition; // 
            shouldFastForward: boolean; // 
        }
        
        // Parameters passed to the 'replayToCompletion' method
        interface ReplayToCompletionParams {
            shouldFastForward: boolean; // 
        }
        
        // Parameters passed to the 'switchSession' method
        interface SwitchSessionParams {
            sessionIdentifier: SessionIdentifier; // 
        }
        
        // Parameters passed to the 'insertSessionSegment' method
        interface InsertSessionSegmentParams {
            sessionIdentifier: SessionIdentifier; // 
            segmentIdentifier: SegmentIdentifier; // 
            segmentIndex: number; // 
        }
        
        // Parameters passed to the 'removeSessionSegment' method
        interface RemoveSessionSegmentParams {
            sessionIdentifier: SessionIdentifier; // 
            segmentIndex: number; // 
        }
        
        // The result from currentReplayState method
        interface CurrentReplayStateResult {
            sessionIdentifier: SessionIdentifier; // 
            segmentIdentifier?: SegmentIdentifier; // If no segment is currently loaded, then there is no valid segment identifier.
            sessionState: SessionState; // 
            segmentState: SegmentState; // 
            replayPosition: ReplayPosition; // 
        }
        
        // The result from getAvailableSessions method
        interface GetAvailableSessionsResult {
            ids: SessionIdentifier[]; // 
        }
        
        // The result from getSessionData method
        interface GetSessionDataResult {
            session?: ReplaySession; // The requested serialized replay session.
        }
        
        // Parameters passed to the 'getSessionData' method
        interface GetSessionDataParams {
            sessionIdentifier: SessionIdentifier; // 
        }
        
        // The result from getSegmentData method
        interface GetSegmentDataResult {
            segment?: SessionSegment; // The requested serialized session segment.
        }
        
        // Parameters passed to the 'getSegmentData' method
        interface GetSegmentDataParams {
            id: SegmentIdentifier; // 
        }
        
        // Parameters passed to the 'playbackHitPosition' method
        interface PlaybackHitPositionEventArgs {
            position: ReplayPosition; // The playback position that was hit.
            timestamp: number; // A timestamp for the event.
        }
        
        // Parameters passed to the 'playbackPaused' method
        interface PlaybackPausedEventArgs {
            position: ReplayPosition; // The playback position immediately prior to where playback is paused.
        }
        
        // Parameters passed to the 'inputSuppressionChanged' method
        interface InputSuppressionChangedEventArgs {
            willSuppress: boolean; // Whether user inputs will be suppressed during playback.
        }
        
        // Parameters passed to the 'sessionCreated' method
        interface SessionCreatedEventArgs {
            id: SessionIdentifier; // Identifier for the created session.
        }
        
        // Parameters passed to the 'sessionModified' method
        interface SessionModifiedEventArgs {
            id: SessionIdentifier; // Identifier for the session the segment was added to.
        }
        
        // Parameters passed to the 'sessionRemoved' method
        interface SessionRemovedEventArgs {
            id: SessionIdentifier; // Identifier for the removed session.
        }
        
        // Parameters passed to the 'sessionLoaded' method
        interface SessionLoadedEventArgs {
            id: SessionIdentifier; // Identifier for the loaded session.
        }
        
        // Parameters passed to the 'segmentCreated' method
        interface SegmentCreatedEventArgs {
            id: SegmentIdentifier; // Identifier for the created session segment.
        }
        
        // Parameters passed to the 'segmentRemoved' method
        interface SegmentRemovedEventArgs {
            id: SegmentIdentifier; // Identifier for the removed session segment.
        }
        
        // Parameters passed to the 'segmentCompleted' method
        interface SegmentCompletedEventArgs {
            id: SegmentIdentifier; // Identifier for the completed session segment.
        }
        
        // Parameters passed to the 'segmentLoaded' method
        interface SegmentLoadedEventArgs {
            segmentIdentifier: SegmentIdentifier; // Id for the loaded segment.
        }
    }
    
    // Runtime domain exposes JavaScript runtime by means of remote evaluation and mirror objects. Evaluation results are returned as mirror object that expose object type, string representation and unique identifier that can be used for further object reference. Original objects are maintained in memory unless they are either explicitly released or are released along with the other objects in their object group.
    namespace Runtime {
        
        // Runtime
        interface Runtime {
            parse?(args: ParseParams ): Promise<Webkit.Response<ParseResult>>; // // Parses JavaScript source code for errors.
            evaluate?(args: EvaluateParams ): Promise<Webkit.Response<EvaluateResult>>; // // Evaluates expression on global object.
            callFunctionOn?(args: CallFunctionOnParams ): Promise<Webkit.Response<CallFunctionOnResult>>; // // Calls function with given declaration on the given object. Object group of the result is inherited from the target object.
            getProperties?(args: GetPropertiesParams ): Promise<Webkit.Response<GetPropertiesResult>>; // // Returns properties of a given object. Object group of the result is inherited from the target object.
            getDisplayableProperties?(args: GetDisplayablePropertiesParams ): Promise<Webkit.Response<GetDisplayablePropertiesResult>>; // // Returns displayable properties of a given object. Object group of the result is inherited from the target object. Displayable properties are own properties, internal properties, and native getters in the prototype chain (assumed to be bindings and treated like own properties for the frontend).
            getCollectionEntries?(args: GetCollectionEntriesParams ): Promise<Webkit.Response<GetCollectionEntriesResult>>; // // Returns entries of given Map / Set collection.
            saveResult?(args: SaveResultParams ): Promise<Webkit.Response<SaveResultResult>>; // // Assign a saved result index to this value.
            releaseObject?(args: ReleaseObjectParams ): Promise<Webkit.Response<any>>; // // Releases remote object with given id.
            releaseObjectGroup?(args: ReleaseObjectGroupParams ): Promise<Webkit.Response<any>>; // // Releases all remote objects that belong to a given group.
            run?(): Promise<Webkit.Response<any>>; // // Tells inspected instance(worker or page) that it can run in case it was started paused.
            enable?(): Promise<Webkit.Response<any>>; // // Enables reporting of execution contexts creation by means of <code>executionContextCreated</code> event. When the reporting gets enabled the event will be sent immediately for each existing execution context.
            disable?(): Promise<Webkit.Response<any>>; // // Disables reporting of execution contexts creation.
            getRuntimeTypesForVariablesAtOffsets?(args: GetRuntimeTypesForVariablesAtOffsetsParams ): Promise<Webkit.Response<GetRuntimeTypesForVariablesAtOffsetsResult>>; // // Returns detailed informtation on given function.
            enableTypeProfiler?(): Promise<Webkit.Response<any>>; // // Enables type profiling on the VM.
            disableTypeProfiler?(): Promise<Webkit.Response<any>>; // // Disables type profiling on the VM.
            getBasicBlocks?(args: GetBasicBlocksParams ): Promise<Webkit.Response<GetBasicBlocksResult>>; // // Returns a list of basic blocks for the given sourceID with information about their text ranges and whether or not they have executed.
            // Event: executionContextCreated(ExecutionContextCreatedEventArgs)
        }
        
        type RemoteObjectId = string; // Unique object identifier.
        
        // Mirror object referencing original JavaScript object.
        interface RemoteObject {
            type: string; // Object type.
            subtype?: string; // Object subtype hint. Specified for <code>object</code> <code>function</code> (for class) type values only.
            className?: string; // Object class (constructor) name. Specified for <code>object</code> type values only.
            value?: any; // Remote object value (in case of primitive values or JSON values if it was requested).
            description?: string; // String representation of the object.
            objectId?: RemoteObjectId; // Unique object identifier (for non-primitive values).
            size?: number; // Size of the array/collection. Specified for array/map/set/weakmap/weakset object type values only.
            classPrototype?: RemoteObject; // Remote object for the class prototype. Specified for class object type values only.
            preview?: ObjectPreview; // Preview containing abbreviated property values. Specified for <code>object</code> type values only.
        }
        
        // Object containing abbreviated remote object value.
        interface ObjectPreview {
            type: string; // Object type.
            subtype?: string; // Object subtype hint. Specified for <code>object</code> type values only.
            description?: string; // String representation of the object.
            lossless: boolean; // Determines whether preview is lossless (contains all information of the original object).
            overflow?: boolean; // True iff some of the properties of the original did not fit.
            properties?: PropertyPreview[]; // List of the properties.
            entries?: EntryPreview[]; // List of the entries. Specified for <code>map</code> and <code>set</code> subtype values only.
            size?: number; // Size of the array/collection. Specified for array/map/set/weakmap/weakset object type values only.
        }
        
        interface PropertyPreview {
            name: string; // Property name.
            type: string; // Object type.
            subtype?: string; // Object subtype hint. Specified for <code>object</code> type values only.
            value?: string; // User-friendly property value string.
            valuePreview?: ObjectPreview; // Nested value preview.
            internal?: boolean; // True if this is an internal property.
        }
        
        interface EntryPreview {
            key?: ObjectPreview; // Entry key. Specified for map-like collection entries.
            value: ObjectPreview; // Entry value.
        }
        
        interface CollectionEntry {
            key?: Runtime.RemoteObject; // Entry key of a map-like collection, otherwise not provided.
            value: Runtime.RemoteObject; // Entry value.
        }
        
        // Object property descriptor.
        interface PropertyDescriptor {
            name: string; // Property name or symbol description.
            value?: RemoteObject; // The value associated with the property.
            writable?: boolean; // True if the value associated with the property may be changed (data descriptors only).
            get?: RemoteObject; // A function which serves as a getter for the property, or <code>undefined</code> if there is no getter (accessor descriptors only).
            set?: RemoteObject; // A function which serves as a setter for the property, or <code>undefined</code> if there is no setter (accessor descriptors only).
            configurable: boolean; // True if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object.
            enumerable: boolean; // True if this property shows up during enumeration of the properties on the corresponding object.
            wasThrown?: boolean; // True if the result was thrown during the evaluation.
            isOwn?: boolean; // True if the property is owned for the object.
            symbol?: Runtime.RemoteObject; // Property symbol object, if the property is a symbol.
            nativeGetter?: boolean; // True if the property value came from a native getter.
        }
        
        // Object internal property descriptor. This property isn't normally visible in JavaScript code.
        interface InternalPropertyDescriptor {
            name: string; // Conventional property name.
            value?: RemoteObject; // The value associated with the property.
        }
        
        // Represents function call argument. Either remote object id <code>objectId</code> or primitive <code>value</code> or neither of (for undefined) them should be specified.
        interface CallArgument {
            value?: any; // Primitive value.
            objectId?: RemoteObjectId; // Remote object handle.
        }
        
        type ExecutionContextId = number; // Id of an execution context.
        
        // Description of an isolated world.
        interface ExecutionContextDescription {
            id: ExecutionContextId; // Unique id of the execution context. It can be used to specify in which execution context script evaluation should be performed.
            isPageContext: boolean; // True if this is a context where inpspected web page scripts run. False if it is a content script isolated context.
            name: string; // Human readable name describing given context.
            frameId: Network.FrameId; // Id of the owning frame.
        }
        
        type SyntaxErrorType = string; // Syntax error type: "none" for no error, "irrecoverable" for unrecoverable errors, "unterminated-literal" for when there is an unterminated literal, "recoverable" for when the expression is unfinished but valid so far.
        
        // Range of an error in source code.
        interface ErrorRange {
            startOffset: number; // Start offset of range (inclusive).
            endOffset: number; // End offset of range (exclusive).
        }
        
        interface StructureDescription {
            fields?: string[]; // Array of strings, where the strings represent object properties.
            optionalFields?: string[]; // Array of strings, where the strings represent optional object properties.
            constructorName?: string; // Name of the constructor.
            prototypeStructure?: StructureDescription; // Pointer to the StructureRepresentation of the protoype if one exists.
            isImprecise?: boolean; // If true, it indicates that the fields in this StructureDescription may be inaccurate. I.e, there might have been fields that have been deleted before it was profiled or it has fields we haven't profiled.
        }
        
        interface TypeSet {
            isFunction: boolean; // Indicates if this type description has been type Function.
            isUndefined: boolean; // Indicates if this type description has been type Undefined.
            isNull: boolean; // Indicates if this type description has been type Null.
            isBoolean: boolean; // Indicates if this type description has been type Boolean.
            isInteger: boolean; // Indicates if this type description has been type Integer.
            isNumber: boolean; // Indicates if this type description has been type Number.
            isString: boolean; // Indicates if this type description has been type String.
            isObject: boolean; // Indicates if this type description has been type Object.
            isSymbol: boolean; // Indicates if this type description has been type Symbol.
        }
        
        // Container for type information that has been gathered.
        interface TypeDescription {
            isValid: boolean; // If true, we were able to correlate the offset successfuly with a program location. If false, the offset may be bogus or the offset may be from a CodeBlock that hasn't executed.
            leastCommonAncestor?: string; // Least common ancestor of all Constructors if the TypeDescription has seen any structures. This string is the display name of the shared constructor function.
            typeSet?: TypeSet; // Set of booleans for determining the aggregate type of this type description.
            structures?: StructureDescription[]; // Array of descriptions for all structures seen for this variable.
            isTruncated?: boolean; // If true, this indicates that no more structures are being profiled because some maximum threshold has been reached and profiling has stopped because of memory pressure.
        }
        
        // Describes the location of an expression we want type information for.
        interface TypeLocation {
            typeInformationDescriptor: number; // What kind of type information do we want (normal, function return values, 'this' statement).
            sourceID: string; // sourceID uniquely identifying a script
            divot: number; // character offset for assignment range
        }
        
        // From Wikipedia: a basic block is a portion of the code within a program with only one entry point and only one exit point. This type gives the location of a basic block and if that basic block has executed.
        interface BasicBlock {
            startOffset: number; // Start offset of the basic block.
            endOffset: number; // End offset of the basic block.
            hasExecuted: boolean; // Indicates if the basic block has executed before.
            executionCount: number; // Indicates how many times the basic block has executed.
        }
        
        // The result from parse method
        interface ParseResult {
            result: SyntaxErrorType; // Parse result.
            message?: string; // Parse error message.
            range?: ErrorRange; // Range in the source where the error occurred.
        }
        
        // Parameters passed to the 'parse' method
        interface ParseParams {
            source: string; // Source code to parse.
        }
        
        // The result from evaluate method
        interface EvaluateResult {
            result: RemoteObject; // Evaluation result.
            wasThrown?: boolean; // True if the result was thrown during the evaluation.
            savedResultIndex?: number; // If the result was saved, this is the $n index that can be used to access the value.
        }
        
        // Parameters passed to the 'evaluate' method
        interface EvaluateParams {
            expression: string; // Expression to evaluate.
            objectGroup?: string; // Symbolic group name that can be used to release multiple objects.
            includeCommandLineAPI?: boolean; // Determines whether Command Line API should be available during the evaluation.
            doNotPauseOnExceptionsAndMuteConsole?: boolean; // Specifies whether evaluation should stop on exceptions and mute console. Overrides setPauseOnException state.
            contextId?: Runtime.ExecutionContextId; // Specifies in which isolated context to perform evaluation. Each content script lives in an isolated context and this parameter may be used to specify one of those contexts. If the parameter is omitted or 0 the evaluation will be performed in the context of the inspected page.
            returnByValue?: boolean; // Whether the result is expected to be a JSON object that should be sent by value.
            generatePreview?: boolean; // Whether preview should be generated for the result.
            saveResult?: boolean; // Whether the resulting value should be considered for saving in the $n history.
        }
        
        // The result from callFunctionOn method
        interface CallFunctionOnResult {
            result: RemoteObject; // Call result.
            wasThrown?: boolean; // True if the result was thrown during the evaluation.
        }
        
        // Parameters passed to the 'callFunctionOn' method
        interface CallFunctionOnParams {
            objectId: RemoteObjectId; // Identifier of the object to call function on.
            functionDeclaration: string; // Declaration of the function to call.
            arguments?: CallArgument[]; // Call arguments. All call arguments must belong to the same JavaScript world as the target object.
            doNotPauseOnExceptionsAndMuteConsole?: boolean; // Specifies whether function call should stop on exceptions and mute console. Overrides setPauseOnException state.
            returnByValue?: boolean; // Whether the result is expected to be a JSON object which should be sent by value.
            generatePreview?: boolean; // Whether preview should be generated for the result.
        }
        
        // The result from getProperties method
        interface GetPropertiesResult {
            result: PropertyDescriptor[]; // Object properties.
            internalProperties?: InternalPropertyDescriptor[]; // Internal object properties.
        }
        
        // Parameters passed to the 'getProperties' method
        interface GetPropertiesParams {
            objectId: RemoteObjectId; // Identifier of the object to return properties for.
            ownProperties?: boolean; // If true, returns properties belonging only to the object itself, not to its prototype chain.
            generatePreview?: boolean; // Whether preview should be generated for property values.
        }
        
        // The result from getDisplayableProperties method
        interface GetDisplayablePropertiesResult {
            properties: PropertyDescriptor[]; // Object properties.
            internalProperties?: InternalPropertyDescriptor[]; // Internal object properties.
        }
        
        // Parameters passed to the 'getDisplayableProperties' method
        interface GetDisplayablePropertiesParams {
            objectId: RemoteObjectId; // Identifier of the object to return properties for.
            generatePreview?: boolean; // Whether preview should be generated for property values.
        }
        
        // The result from getCollectionEntries method
        interface GetCollectionEntriesResult {
            entries: CollectionEntry[]; // Array of collection entries.
        }
        
        // Parameters passed to the 'getCollectionEntries' method
        interface GetCollectionEntriesParams {
            objectId: Runtime.RemoteObjectId; // Id of the collection to get entries for.
            objectGroup?: string; // Symbolic group name that can be used to release multiple. If not provided, it will be the same objectGroup as the RemoteObject determined from <code>objectId</code>. This is useful for WeakMap to release the collection entries.
            startIndex?: number; // If provided skip to this index before collecting values. Otherwise, 0.
            numberToFetch?: number; // If provided only return <code>numberToFetch</code> values. Otherwise, return values all the way to the end.
        }
        
        // The result from saveResult method
        interface SaveResultResult {
            savedResultIndex?: number; // If the value was saved, this is the $n index that can be used to access the value.
        }
        
        // Parameters passed to the 'saveResult' method
        interface SaveResultParams {
            value: CallArgument; // Id or value of the object to save.
            contextId?: ExecutionContextId; // Unique id of the execution context. To specify in which execution context script evaluation should be performed. If not provided, determine from the CallArgument's objectId.
        }
        
        // Parameters passed to the 'releaseObject' method
        interface ReleaseObjectParams {
            objectId: RemoteObjectId; // Identifier of the object to release.
        }
        
        // Parameters passed to the 'releaseObjectGroup' method
        interface ReleaseObjectGroupParams {
            objectGroup: string; // Symbolic object group name.
        }
        
        // The result from getRuntimeTypesForVariablesAtOffsets method
        interface GetRuntimeTypesForVariablesAtOffsetsResult {
            types: TypeDescription[]; // 
        }
        
        // Parameters passed to the 'getRuntimeTypesForVariablesAtOffsets' method
        interface GetRuntimeTypesForVariablesAtOffsetsParams {
            locations: TypeLocation[]; // An array of type locations we're requesting information for. Results are expected in the same order they're sent in.
        }
        
        // The result from getBasicBlocks method
        interface GetBasicBlocksResult {
            basicBlocks: BasicBlock[]; // 
        }
        
        // Parameters passed to the 'getBasicBlocks' method
        interface GetBasicBlocksParams {
            sourceID: string; // Indicates which sourceID information is requested for.
        }
        
        // Parameters passed to the 'executionContextCreated' method
        interface ExecutionContextCreatedEventArgs {
            context: ExecutionContextDescription; // A newly created execution contex.
        }
    }
    
    // Timeline provides its clients with instrumentation records that are generated during the page runtime. Timeline instrumentation can be started and stopped using corresponding commands. While timeline is started, it is generating timeline event records.
    namespace Timeline {
        
        // Timeline
        interface Timeline {
            start?(args: StartParams ): Promise<Webkit.Response<any>>; // // Starts capturing instrumentation events.
            stop?(): Promise<Webkit.Response<any>>; // // Stops capturing instrumentation events.
            // Event: eventRecorded(EventRecordedEventArgs)
            // Event: recordingStarted(RecordingStartedEventArgs)
            // Event: recordingStopped(RecordingStoppedEventArgs)
        }
        
        type EventType = string; // Timeline record type.
        
        // Timeline record contains information about the recorded activity.
        interface TimelineEvent {
            type: EventType; // Event type.
            data: any; // Event data.
            children?: TimelineEvent[]; // Nested records.
        }
        
        // Aggregate CPU Profile call info. Holds time information for all the calls that happened on a node.
        interface CPUProfileNodeAggregateCallInfo {
            callCount: number; // Total number of calls.
            startTime: number; // Start time for the first call.
            endTime: number; // End time for the last call.
            totalTime: number; // Total execution time for all calls combined.
        }
        
        // CPU Profile node. Holds callsite information, execution statistics and child nodes.
        interface CPUProfileNode {
            id: number; // Unique identifier for this call site.
            callInfo: CPUProfileNodeAggregateCallInfo; // Aggregate info about all the calls that making up this node.
            functionName?: string; // Function name.
            url?: string; // URL.
            lineNumber?: number; // Line number.
            columnNumber?: number; // Column number.
            children?: CPUProfileNode[]; // Child nodes.
        }
        
        // Profile.
        interface CPUProfile {
            rootNodes: CPUProfileNode[]; // Top level nodes in the stack.
            idleTime?: number; // 
        }
        
        // Parameters passed to the 'start' method
        interface StartParams {
            maxCallStackDepth?: number; // Samples JavaScript stack traces up to <code>maxCallStackDepth</code>, defaults to 5.
        }
        
        // Parameters passed to the 'eventRecorded' method
        interface EventRecordedEventArgs {
            record: TimelineEvent; // Timeline event record data.
        }
        
        // Parameters passed to the 'recordingStarted' method
        interface RecordingStartedEventArgs {
            startTime: number; // Start time of this new recording.
        }
        
        // Parameters passed to the 'recordingStopped' method
        interface RecordingStoppedEventArgs {
            endTime: number; // End time of this recording.
        }
    }
    
    namespace Worker {
        
        // Worker
        interface Worker {
            enable?(): Promise<Webkit.Response<any>>; // 
            disable?(): Promise<Webkit.Response<any>>; // 
            sendMessageToWorker?(args: SendMessageToWorkerParams ): Promise<Webkit.Response<any>>; // 
            canInspectWorkers?(): Promise<Webkit.Response<CanInspectWorkersResult>>; // // Tells whether browser supports workers inspection.
            connectToWorker?(args: ConnectToWorkerParams ): Promise<Webkit.Response<any>>; // 
            disconnectFromWorker?(args: DisconnectFromWorkerParams ): Promise<Webkit.Response<any>>; // 
            setAutoconnectToWorkers?(args: SetAutoconnectToWorkersParams ): Promise<Webkit.Response<any>>; // 
            // Event: workerCreated(WorkerCreatedEventArgs)
            // Event: workerTerminated(WorkerTerminatedEventArgs)
            // Event: dispatchMessageFromWorker(DispatchMessageFromWorkerEventArgs)
            // Event: disconnectedFromWorker()
        }
        
        // Parameters passed to the 'sendMessageToWorker' method
        interface SendMessageToWorkerParams {
            workerId: number; // 
            message: any; // 
        }
        
        // The result from canInspectWorkers method
        interface CanInspectWorkersResult {
            result: boolean; // True if browser has workers support.
        }
        
        // Parameters passed to the 'connectToWorker' method
        interface ConnectToWorkerParams {
            workerId: number; // 
        }
        
        // Parameters passed to the 'disconnectFromWorker' method
        interface DisconnectFromWorkerParams {
            workerId: number; // 
        }
        
        // Parameters passed to the 'setAutoconnectToWorkers' method
        interface SetAutoconnectToWorkersParams {
            value: boolean; // 
        }
        
        // Parameters passed to the 'workerCreated' method
        interface WorkerCreatedEventArgs {
            workerId: number; // 
            url: string; // 
            inspectorConnected: boolean; // 
        }
        
        // Parameters passed to the 'workerTerminated' method
        interface WorkerTerminatedEventArgs {
            workerId: number; // 
        }
        
        // Parameters passed to the 'dispatchMessageFromWorker' method
        interface DispatchMessageFromWorkerEventArgs {
            workerId: number; // 
            message: any; // 
        }
    }
}
