<script lang="ts">

</script>

<div id="alphaWarning">
    <strong>WARNING:</strong> MARCHBLOCKS IS IN BETA. A FEW THINGS ARE NONFUNCTIONAL. SYNTAX AND BLOCKS ARE SUBJECT TO CHANGE. EXPECT BUGS, FEEDBACK IS APPRECIATED!
</div>

<style>
    #alphaWarning {
        position: fixed;
        bottom: 20px;
        right: 80px; 
        
        color: #ff4d4d;
        font-size: 12px;
        font-weight: bold;
        text-align: right;
        text-transform: uppercase;
        
        background: none;
        text-shadow: 
            1px 1px 0px #000, 
            -1px -1px 0px #000, 
            1px -1px 0px #000, 
            -1px 1px 0px #000,
            0px 0px 8px rgba(0,0,0,0.8);
            
        z-index: 9999;
        max-width: 350px;
        pointer-events: none;
        font-family: inherit;
        line-height: 1.2;
        opacity: 0.9;
    }
</style>